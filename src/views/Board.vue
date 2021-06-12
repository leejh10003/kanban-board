<template>
  <div v-if="$apollo.queries.lists.loading"></div>
  <div v-else class="row">
    <draggable class="list-group containers" :list="lists" group="column">
      <div class="list-for" v-for="(list, index) in lists" :key="index">
        <div class="list-container">
          <div class="col-3">
            <div style="display: flex; align-items: baseline">
              <h4 class="column-name">{{ list.name }}</h4>
              <vs-button
                style="margin-left: auto"
                v-if="list.adding === false"
                :active="true"
                @click="list.adding = true"
              >
                Add
              </vs-button>
            </div>
            <div class="list-card">
              <card v-if="list.adding === true">
                <template #hero>
                  <img :src="''" alt="" />
                </template>
                <template #body>
                  <vs-input
                    type="text"
                    v-model="list.addContent"
                    placeholder="내용"
                  />
                </template>
                <template #tailing>
                  <div style="display: flex; justify-content: flex-end;">
                    <vs-button
                      type="filled"
                      color="primary"
                      v-on:click="addCard(list.id, list.addContent)"
                    >
                      추가
                    </vs-button>
                    <vs-button
                      type="filled"
                      color="danger"
                      v-on:click="list.adding = false"
                    >
                      취소
                    </vs-button>
                  </div>
                </template>
              </card>
              <draggable class="list-group " :list="list.cards" group="card">
                <div v-for="element in list.cards" :key="element.id">
                  <Task v-bind:element="{ ...element }" />
                </div>
              </draggable>
            </div>
          </div>
        </div>
      </div>

      <div class="column-adder">
        <vs-button
          class="add-button"
          type="filled"
          color="primary"
          v-if="addingColumn === false"
          @click="addingColumn = true"
          >Add new column</vs-button
        >
        <div v-if="addingColumn === true">
          <template>
            <div>
              <vs-input
                type="text"
                v-model="addColumnTitle"
                label="컬럼 제목"
              />
            </div>
            <div>
              <vs-button
                type="filled"
                color="primary"
                v-on:click="addColumn(addColumnTitle)"
              >
                추가
              </vs-button>
            </div>
          </template>
        </div>
      </div>
    </draggable>
  </div>
</template>

<style lang="scss" scoped>
.column-name {
  text-align: left;
  padding-left: 10px;
}

.column-adder {
  padding-top: 20px;
}
.add-button {
}

.divider {
  margin: 1rem;
  height: 90%;
  content: "";
  display: block;
  border: 1px solid #ccc;
  position: relative;
}

.containers {
  display: flex;
}

.list-for {
  display: flex;
}

.list-container {
  min-width: 380px;
  padding: 1rem;
}

.list-card {
  background: #d1d1d1;
  box-shadow: 0 0.1875rem 1.5rem rgba(0, 0, 0, 0.2);
  border-radius: 0.375rem;
  min-height: 50px;
}
</style>

<script>
import draggable from "vuedraggable";
import gql from "graphql-tag";
import Task from "../components/Task";
import card from '../components/Card.vue'

export default {
  name: "two-lists",
  display: "Two Lists",
  order: 1,
  components: {
    card,
    draggable,
    Task,
  },
  data() {
    return {
      loading: null,
      addingColumn: false,
      addColumnTitle: "",
    };
  },
  created() {
    this.loading = this.$vs.loading({
      type: "corners",
      color: "#2BD400",
      scale: 4,
      text: "로딩 중...",
    });
  },
  apollo: {
    lists: {
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      query: gql`
        query ($id: Int!) {
          columns(where: { board_id: { _eq: $id } }) {
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
        }
      `,
      update(data) {
        this.loading.close();
        return data.columns.map((e) => ({
          adding: false,
          addContent: "",
          ...e,
        }));
      },
    },
  },
  methods: {
    replace: function () {
      this.list = [{ name: "Edgard" }];
    },
    clone: function (el) {
      return {
        name: el.name + " cloned",
      };
    },
    addCard: async function (list_id, content) {
      //TODO : modify user id
      await this.$apollo.mutate({
        mutation: gql`
          mutation addCard($list_id: Int!, $content: String!) {
            insert_card_description(
              objects: [
                {
                  card: { data: { created_by_user_id: 1, column_id: $list_id } }
                  content: $content
                  user_id: 1
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
          list_id,
          content,
        },
      });
      this.$apollo.queries.lists.refetch();
    },
    addColumn: async function (boardName) {
      const boardId = this.$route.params.id;
      //TODO : modify user id
      await this.$apollo.mutate({
        mutation: gql`
          mutation addColumn($board_id: Int!, $name: String!) {
            insert_columns(
              objects: [
                {
                  board_id: $board_id,
                  name: $name
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
          name: boardName,
        },
      });
      this.$data.addingColumn = false;
      this.$apollo.queries.lists.refetch();
    },
  },
};
</script>