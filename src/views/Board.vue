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
        <div v-if="list.adding === true">
          <template>
          <div slot="header">
            <img :src="''" alt="">
          </div>
          <div>
            <vs-input
              type="text"
              v-model="list.addContent"
              label="내용"
            />
          </div>
          <div>
            <vs-button type="filled" color="primary" v-on:click="addCard(list.id, list.addContent)">
              추가
            </vs-button>
            <vs-button type="filled" color="danger" v-on:click="list.adding = false">
              취소
            </vs-button>
          </div>
          </template>
        </div>
        <draggable class="list-group" :list="list.cards" group="card">
            <div
            v-for="(element) in list.cards"
            :key="element.id">
              <Task v-bind:element="{...element}"/>
            </div>
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
import Task from '../components/Task'

export default {
  name: "two-lists",
  display: "Two Lists",
  order: 1,
  components: {
    draggable,
    Task
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
    replace: function() {
      this.list = [{ name: "Edgard" }];
    },
    clone: function(el) {
      return {
        name: el.name + " cloned"
      };
    },
    addCard: function(list_id, content) {
       //TODO : modify user id
      this.$apollo.mutate({
        mutation: gql`mutation addCard(
          $list_id: Int!
          $content: String!
          ) {
            insert_card_description(
                objects: [
                  {
                    card: {
                      data: {
                        created_by_user_id: 1
                        column_id: $list_id
                      }
                    }
                    content: $content
                    user_id: 1
                  }
                ]
            ) 
            {
                returning {
                    id
                }
            }
        }`,
        variables: {
          list_id,
          content,
        },
      }).then(() => {
        this.$apollo.queries.lists.refetch();
      });
    }
  }
};
</script>