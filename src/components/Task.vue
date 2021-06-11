<template>
  <Card>
    <template #hero>
      <img class="hero" v-if="!!element.created_by && !!element.created_by.thumbnail" :src="element.created_by.thumbnail" />
    </template>
    <template #title>
      <h3>{{getTitle(element)}}</h3>
    </template>
    <template #body>
      <div v-for="(paragraph, index) in element.card_descriptions" :key="index">
        <p class="post-description">{{ paragraph.content }}</p>
      </div>
    </template>
    <template #tailing>
      <div class="post-author">
        <vs-button transparent color="primary">
          테스트 태그
        </vs-button>
        <vs-button transparent color="danger">
          테스트 태그
        </vs-button>
      </div>
    </template>
  </Card>
</template>
<script>
import Card from './Card.vue'
export default {
  components: {
    Card
  },
  props: {
    element: Object,
    title: String
  },
  methods: {
    getTitle: (element) => (element?.card_descriptions?.[0]?.content || element?.card_descriptions?.[0]?.hyperlink) ?? '',
  }
}
</script>