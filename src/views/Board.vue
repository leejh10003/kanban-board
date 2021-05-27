<template>
  <div class="row">
    <draggable class="list-group containers" :list="lists" group="column">
      <div class="col-3" v-for="(list, index) in lists" :key="index">
        <h3>{{list.name}}</h3>
        <vs-button
          v-if="list.adding === false"
          :active="true"
          @click="list.adding = true"
        >
            Add
        </vs-button>
        <vs-card v-if="list.adding === true">
          <template #img>
            <img :src="''" alt="">
          </template>
          <template #text>
            <vs-input
              type="text"
              v-model="list.addContent"
              label="내용"
            />
          </template>
          <template #interactions>
            <vs-button danger icon>
              <i class='bx bx-heart'></i>
            </vs-button>
            <vs-button class="btn-chat" shadow primary>
              <i class='bx bx-chat' ></i>
              <span class="span">
                54
              </span>
            </vs-button>
          </template>
        </vs-card>
        <draggable class="list-group" :list="list.cards" group="card">
            <vs-card
            v-for="(element) in list.cards"
            :key="element.id">
              <template #title>
                <h3>{{ getTitle(element) }}</h3>
              </template>
              <template #img>
                <img :src="element.created_by.thumbnail" alt="">
              </template>
              <template #text>
                <div v-for="(paragraph, index) in element.card_descriptions" :key="index">
                  <a v-if="!!(paragraph.hyperlink)" :href="paragraph.hyperlink">{{paragraph.content}}</a>
                  <p v-else-if="!!(paragraph.content)">
                    {{paragraph.content}}
                  </p>
                </div>
              </template>
              <template #interactions>
                <vs-button danger icon>
                  <i class='bx bx-heart'></i>
                </vs-button>
                <vs-button class="btn-chat" shadow primary>
                  <i class='bx bx-chat' ></i>
                  <span class="span">
                    54
                  </span>
                </vs-button>
              </template>
            </vs-card>
        </draggable>
      </div>
    </draggable>
  </div>
</template>

<style scoped>
.containers {
  display: flex;
  justify-content: space-around;
}
</style>

<script>
import draggable from "vuedraggable";
import gql from 'graphql-tag';

export default {
  name: "two-lists",
  display: "Two Lists",
  order: 1,
  components: {
    draggable
  },
  apollo: {
    lists: {
       query: gql`query {
        columns {
          id
          name
          cards {
            card_descriptions {
              card_id
              content
              hyperlink
            }
            created_by {
              name
              thumbnail
            }
            id
            card_taggings {
              tag {
                tag
              }
            }
          }
        }
      }`,
      update: data => data.columns.map(e => ({
        adding: false,
        addContent: "",
        ...e,
      })),
    }
  },
  data() {
    return {
    };
  },
  methods: {
    getTitle: (element) => (element?.card_descriptions?.[0]?.content || element?.card_descriptions?.[0]?.hyperlink) ?? '',
    replace: function() {
      this.list = [{ name: "Edgard" }];
    },
    clone: function(el) {
      return {
        name: el.name + " cloned"
      };
    },
  }
};
</script>