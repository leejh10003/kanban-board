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
        <div class="tag-list">
          <vs-button v-for="(t, index) in element.card_taggings" :key="index" transparent color="primary">
            {{t.tag.tag}}
          </vs-button>
        </div>
        <div class="tag-edit">
          <vs-button transparent icon color="dark" @click="active = true">
            <i class="bx bx-edit"></i>
          </vs-button>
        </div>
      </div>
      <vs-dialog v-model="active">
        <template #header>
          <h4 class="not-margin">Tag edit</h4>
        </template>
        <div class="dialog-tag-list">
          <div v-for="(t, index) in tagList" :key="index">
            <vs-button :border="checkTag(t.id) === false" v-on:click="switchTag(t.id)" dark>{{t.tag}} </vs-button>
          </div>
        </div>
         <template #footer>
          <div class="footer-dialog">
             <vs-input v-model="newTagName" placeholder="New Tag" />
            <vs-button @click="addNewTag(newTagName)">
              Add New Tag
            </vs-button>
          </div>
        </template>
      </vs-dialog>
    </template>
  </Card>
</template>
<style>
.footer-dialog {
  display: flex;
}
.post-description {
  margin: 0px;
}
.tag-list {
  display: flex;
  float: left;
}
.tag-edit {
  display: flex;
  float: right;
}
.dialog-tag-list {
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
      tagIds: {},
      newTagName: ""
    };
  },
  created() {
    this.$props.element.card_taggings.forEach(e => {
      this.$data.tagIds[e.tag.id] = true;
    });
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
      return this.$props.element.card_taggings.map(e => {
        return e.tag.id;
      })
    },
    addNewTag: async function(tagName) {
      const boardId = this.$route.params.id;
      await this.$apollo.mutate({
        mutation: gql`
          mutation addTag($board_id: Int!, $tag_name: String!) {
            insert_tag(
              objects: [
                {
                  board_id: $board_id
                  tag: $tag_name
                }
              ]
            ) {
              returning {
                id
              }
            }
          }
        `,
        variables: {
          board_id: boardId,
          tag_name: tagName
        },
      });

      this.$props.refetch();
    },
    checkTag(id) {
      return !!this.$data.tagIds[id];
    },
    switchTag(id) {
      this.$data.tagIds[id] = !this.$data.tagIds[id];
      console.log(this.$data.tagIds);
    }
  },
};
</script>