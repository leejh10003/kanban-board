<template>
  <Card>
    <template #hero>
      <img
        class="hero"
        v-if="!!element.created_by && !!element.created_by.thumbnail"
        :src="element.created_by.thumbnail"
      />
    </template>
    <template #title>
      <h3 style="margin: 0px">{{ getTitle(element) }}</h3>
    </template>
    <template #body>
      <div v-for="(paragraph, index) in element.card_descriptions" :key="index">
        <p class="post-description">{{ paragraph.content }}</p>
      </div>
    </template>
    <template #tailing>
      <div class="post-author">
        <md-chip v-for="(tag, index) in tags" :key="tag.id" md-deletable @md-delete="removeTagHandler(tag.id, index)">{{ tag.tag }}</md-chip>
        <md-autocomplete v-model="newTagName" :md-options="[newTagName, ...fullTagNames]" @md-selected="insertTagHandler">
          <template slot="md-autocomplete-item" slot-scope="{ item, term }">
            <md-highlight-text v-if="item.tag != null" :md-term="term">{{ item.tag }}</md-highlight-text>
            <div v-else class="autocomplete-create-new-item">
              Create New Tag-<md-highlight-text  :md-term="term">{{ term }}</md-highlight-text>
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
      tags: [],
      fullTagNames: [],
      newTagName: "",
      newTags: [],
    };
  },
  created() {
    this.$data.tags = this.$props.element.card_taggings != null ? this.$props.element.card_taggings.map((e) => {
      return e.tag;
    }) : [];
    this.$data.fullTagNames = this.$props.tagList != null ? this.$props.tagList.map((e) => {
      return {
        ...e,
        'toLowerCase': () => e.tag.toLowerCase()
      };
    }) : [];
  },
  props: {
    element: Object,
    title: String,
    refetch: Function,
    tagList: Array,
  },
  methods: {
    getTitle: (element) =>
      (element?.card_descriptions?.[0]?.content ||
        element?.card_descriptions?.[0]?.hyperlink) ??
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
            insert_card_tagging(objects: [{ tag_id: $tag_id, card_id: $card_id }]) {
              returning {
                card_id
              }
            }
          }
        `,
        variables: {
          tag_id: tagId,
          card_id: cardId
        },
      });
    },
    removeCardTag: async function (tagId, cardId) {
      await this.$apollo.mutate({
        mutation: gql`
          mutation removeCardTag($tag_id: Int!, $card_id: Int!) {
            delete_card_tagging(where: { tag_id: {_eq: $tag_id}, card_id: {_eq: $card_id} }) {
              returning {
                card_id
              }
            }
          }
        `,
        variables: {
          tag_id: tagId,
          card_id: cardId
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
        tag: newTagName
      });

      this.$data.tags.push({
        id: newTagId,
        tag: newTagName
      });

      await this.addCardTag(newTagId, this.$props.element.id);

      this.$data.newTagName = "";
    },
    removeTagHandler: async function (tagId, index) {
      //const equalTag = this.$props.tagList.find(e => e.tag === tag) || this.$data.newTags.find(e => e.tag === tag);
      //const tagId = equalTag.id;
      await this.removeCardTag(tagId, this.$props.element.id);
      
      this.$data.tags.splice(index, 1);
    }
  },
};
</script>