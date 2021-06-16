<template>
  <Card>
    <template #hero>
      <img
        class="hero"
        v-if="!!element.image"
        :src="element.image"
      />
      <img
        class="hero"
        v-else-if="!!element.created_by && !!element.created_by.thumbnail"
        :src="element.created_by.thumbnail"
      />
    </template>
    <template #title>
      <h3 style="margin: 0px">{{ element.card_description != null ? element.card_description.title : ""}}</h3>
    </template>
    <template #body>
      <p class="post-description">{{ element.card_description != null ? element.card_description.content : ""}}</p>
      <div class="div-assign">
        <md-menu md-direction="bottom-end" mdCloseOnClick>
          <vs-avatar md-menu-trigger size="40">
            <img v-if="taggedUser != null && taggedUser.thumbnail != null" :src="taggedUser.thumbnail" />
            <i v-else class="bx bx-user"></i>
          </vs-avatar>
          <!-- <md-button md-menu-trigger class="md-icon-button md-dense">
          <md-icon>account_circle</md-icon>
          </md-button> -->
          <md-menu-content class="assign-menu">
            <md-menu-item
              v-for="(item, index) in users"
              :key="index"
              :disabled="taggedUser != null && item.id === taggedUser.id"
              @click="changeAssigne(item)"
            >
              <div class="menu-item">
                <vs-avatar size="40">
                  <img v-if="item.thumbnail != null" :src="item.thumbnail" />
                  <i v-else class="bx bx-user"></i>
                </vs-avatar>
                <div class="assign-avatar-menu">
                  {{ item.name }}
                </div>
              </div>
            </md-menu-item>
          </md-menu-content>
        </md-menu>
      </div>
    </template>
    <template #tailing>
      <div class="post-author">
        <md-chip
          v-for="(tag, index) in tags"
          :key="tag.id"
          md-deletable
          @md-delete="removeTagHandler(tag.id, index)"
          >{{ tag.tag }}</md-chip
        >
        <md-button
          class="md-icon-button md-dense"
          @click="isAddingTag = !isAddingTag"
        >
          <md-icon v-if="isAddingTag === false">add</md-icon>
          <md-icon v-else>check</md-icon>
        </md-button>
        <md-autocomplete
          v-if="isAddingTag === true"
          v-model="newTagName"
          :md-options="[newTagName, ...fullTags]"
          @md-selected="insertTagHandler"
        >
          <template slot="md-autocomplete-item" slot-scope="{ item, term }">
            <md-highlight-text v-if="item.tag != null" :md-term="term">{{
              item.tag
            }}</md-highlight-text>
            <div v-else class="autocomplete-create-new-item">
              Create New Tag-<md-highlight-text :md-term="term">{{
                term
              }}</md-highlight-text>
            </div>
          </template>
        </md-autocomplete>
        <!-- <md-chips v-model="tags" md-placeholder="Add Tag" @md-insert="insertTagHandler" @md-delete="removeTagHandler"> -->
        <!-- </md-chips> -->
      </div>
    </template>
  </Card>
</template>
<style>
.autocomplete-create-new-item {
  display: flex;
}

.div-assign {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.menu-item {
  display: flex;
  align-items: center;
}

.assign-avatar-menu {
  display: flex;
  margin-left: 10px;
  text-align: left;
  justify-content: flex-start;
}
</style>
<script>
import Card from "./Card.vue";
import gql from "graphql-tag";
export default {
  components: {
    Card,
  },
  data() {
    return {
      active: false,
      isAddingTag: false,
      tags: [],
      fullTags: [],
      newTagName: "",
      newTags: [],
      taggedUser: null,
    };
  },
  created() {
    this.$data.tags =
      this.$props.element.card_taggings != null
        ? this.$props.element.card_taggings.map((e) => {
            return e.tag;
          })
        : [];
    this.$data.fullTags =
      this.$props.tagList != null
        ? this.$props.tagList
            .filter((e) => {
              return !this.$data.tags.find((t) => t.id == e.id);
            })
            .map((e) => {
              return {
                ...e,
                toLowerCase: () => e.tag.toLowerCase(),
              };
            })
        : [];
    if (this.$props.element.user_card_taggings.length > 0) {
      this.$data.taggedUser = this.$props.element.user_card_taggings[0].user;
    }
  },
  props: {
    element: Object,
    title: String,
    refetch: Function,
    tagList: Array,
    users: Array,
  },
  methods: {
    getTitle: (element) =>
      (element?.card_description?.content ||
        element?.card_description?.hyperlink) ??
      "",
    getTagIds() {
      return this.$props.element.card_taggings.map((e) => {
        return e.tag.id;
      });
    },
    addTag: async function (tagName) {
      const boardId = this.$route.params.id;
      const data = await this.$apollo.mutate({
        mutation: gql`
          mutation addTag($board_id: Int!, $tag_name: String!) {
            insert_tag(objects: [{ board_id: $board_id, tag: $tag_name }]) {
              returning {
                id
              }
            }
          }
        `,
        variables: {
          board_id: boardId,
          tag_name: tagName,
        },
      });
      return data.data.insert_tag.returning[0].id;
    },
    addCardTag: async function (tagId, cardId) {
      await this.$apollo.mutate({
        mutation: gql`
          mutation addCardTag($tag_id: Int!, $card_id: Int!) {
            insert_card_tagging(
              objects: [{ tag_id: $tag_id, card_id: $card_id }]
            ) {
              returning {
                card_id
              }
            }
          }
        `,
        variables: {
          tag_id: tagId,
          card_id: cardId,
        },
      });
    },
    removeCardTag: async function (tagId, cardId) {
      await this.$apollo.mutate({
        mutation: gql`
          mutation removeCardTag($tag_id: Int!, $card_id: Int!) {
            delete_card_tagging(
              where: { tag_id: { _eq: $tag_id }, card_id: { _eq: $card_id } }
            ) {
              returning {
                card_id
              }
            }
          }
        `,
        variables: {
          tag_id: tagId,
          card_id: cardId,
        },
      });
    },
    insertTagHandler: async function (newTag) {
      // const equalTag = this.$props.tagList.find(e => e.tag === newTag);
      let newTagId;
      let newTagName;
      // console.log(equalTag);
      if (newTag.id != null) {
        newTagId = newTag.id;
        newTagName = newTag.tag;
      } else {
        newTagId = await this.addTag(newTag);
        newTagName = newTag;
      }

      this.$data.newTags.push({
        id: newTagId,
        tag: newTagName,
      });

      this.$data.tags.push({
        id: newTagId,
        tag: newTagName,
      });

      this.$data.fullTags = this.$data.fullTags.filter((e) => {
        return e.id != newTagId;
      });

      this.$data.newTagName = "";
      await this.addCardTag(newTagId, this.$props.element.id);
      this.$data.newTagName = "";
    },
    removeTagHandler: async function (tagId, index) {
      //const equalTag = this.$props.tagList.find(e => e.tag === tag) || this.$data.newTags.find(e => e.tag === tag);
      //const tagId = equalTag.id;
      await this.removeCardTag(tagId, this.$props.element.id);

      this.$data.tags.splice(index, 1);
    },
    changeAssigne: async function (user) {
      const userId = user.id;
      const cardId = this.$props.element.id;
      await this.$apollo.mutate({
        mutation: gql`
          mutation addCardTagging($user_id: Int!, $card_id: Int!) {
            insert_user_card_tagging(
              objects: { card_id: $card_id, user_id: $user_id }
              on_conflict: {
                update_columns: user_id
                constraint: user_card_tagging_pkey
                where: { card_id: { _eq: $card_id } }
              }
            ) {
              returning {
                card_id
              }
            }
          }
        `,
        variables: {
          user_id: userId,
          card_id: cardId,
        },
      });

      this.$data.taggedUser = user;
    },
  },
};
</script>