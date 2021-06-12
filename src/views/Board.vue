<template>
  <div v-if="$apollo.queries.lists.loading"></div>
  <div v-else class="row">
    <draggable class="list-group containers" :list="lists" group="column">
      <div class="list-for" v-for="(list, index) in lists" :key="index">
        <div class="list-container">
          <div class="col-3">
            <div style="display: flex; align-items: baseline">
              <h4 @click="list.fixingTitle = true" class="column-name" v-if="list.fixingTitle === false">{{ list.name }}</h4>
              <input @keydown.enter="fixListTitle(list)" v-else v-model="list.name" class="column-name" placeholder="제목"/>
              <vs-button
                circle
                icon
                dark
                transparent
                style="margin-left: auto"
                v-if="list.adding === false && list.fixingTitle === false"
                @click="fixListTitle(list)"
              >
                <i class ="bx bx-plus"/>
              </vs-button>
              <vs-button
                circle
                icon
                transparent
                style="margin-left: auto"
                @click="list.fixingTitle = false"
                v-if="list.adding === false && list.fixingTitle === true"
              >
                <i class ="bx bx-check"/>
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
                  <Task style="max-width: 300px" v-bind:element="{ ...element }" v-bind:refetch="refetch" v-bind:tagList="tags"/>
                </div>
              </draggable>
            </div>
          </div>
        </div>
      </div>

      <div class="column-adder">
        <vs-button
          style="margin-top: calc(23px)"
          icon
          transparent
          flat
          class="add-button"
          type="filled"
          color="primary"
          v-if="addingColumn === false"
          @click="addingColumn = true"
          ><i class="bx bx-plus"></i>새 칼럼 추가</vs-button
        >
        <div class="list-for" v-if="addingColumn">
          <div class="list-container">
            <div class="col-3">
              <div style="display: flex; align-items: baseline">
                <input v-model="addColumnTitle" class="column-name" placeholder="제목"/>
                <vs-button
                  circle
                  icon
                  transparent
                  @click="addColumn(addColumnTitle)"
                >
                  <i class ="bx bx-check"/>
                </vs-button>
                <vs-button
                  circle
                  icon
                  danger
                  transparent
                  v-model="addColumnTitle"
                  @click="addColumnClear"
                >
                  <i class ="bx bx-x"/>
                </vs-button>
              </div>
              <div class="list-card"/>
            </div>
          </div>
        </div>
      </div>
    </draggable>
  </div>
</template>

<style lang="scss" scoped>
.column-name {
  text-align: left;
  padding-left: 10px;
  margin: 18.62px 0px;
  margin-top: 18.62px;
  height: 20px;
  padding: 0px 0px 0px 10px;
  font-family: Noto Sans KR, Helvetica;
  background-color:transparent;
  border: 0px;
  width: calc(100% - 70px);
  font-weight: bold;
  border: 1px solid transparent;
}
.column-name:hover{
  border: 1px solid #dddddd;
  border-radius: 8px;
}
.col-3{
  width: 300px
}
.list-for{
  width: 340px
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
.column-adder{
  min-width: 110px
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
                  id
                  tag
                }
              }
            }
          }

          tag(where: { board_id: { _eq: $id } }) {
            id
            tag
          }
        }
      `,
      update(data) {
        this.loading.close();
        return data.columns.map((e) => ({
          adding: false,
          addContent: "",
          fixingTitle: false,
          ...e,
        }));
      },
    },
    tags: {
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      query: gql`
        query ($id: Int!) {
          tag(where: { board_id: { _eq: $id } }) {
            id
            tag
          }
        }
      `,
      update(data) {
        return data.tag;
      },
    },
  },
  methods: {
    async fixListTitle(list){
      await this.$apollo.mutate({
        variables: {
          name: list.name,
          id: list.id
        },
        mutation: gql`mutation($name: String!, $id: Int!){
          update_columns_by_pk(pk_columns: {id: $id}, _set: {name: $name}){
            id
          }
        }`
      })
      list.fixingTitle = false
    },
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
    addColumnClear: function(){
      this.addingColumn = false
      this.addColumnTitle = ""
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
    },
    refetch: function () {
      this.$apollo.queries.lists.refetch();
      this.$apollo.queries.tags.refetch();
    }
  },
};
</script>