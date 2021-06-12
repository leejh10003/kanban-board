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
        <el-select
          class="tag-select"
          v-model="tagIds"
          multiple
          filterable
          allow-create
          default-first-option
        >
          <el-option
            v-for="item in tagList"
            :key="item.id"
            :label="item.tag"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
    </template>
  </Card>
</template>
<style>
.el-select {
  width: 80%;
  color: black;
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
      tagIds: [],
      newTagName: "",
    };
  },
  created() {
    this.$data.tagIds = this.$props.element.card_taggings.map((e) => {
      return e.tag.id;
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
      return this.$props.element.card_taggings.map((e) => {
        return e.tag.id;
      });
    },
    addNewTag: async function (tagName) {
      const boardId = this.$route.params.id;
      await this.$apollo.mutate({
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

      this.$props.refetch();
    },
    checkTag(id) {
      return !!this.$data.tagIds[id];
    },
    switchTag(id) {
      this.$data.tagIds[id] = !this.$data.tagIds[id];
      console.log(this.$data.tagIds);
    },
  },
};
</script>