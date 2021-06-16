<template>
  <div v-if="$apollo.queries.lists.loading"></div>
  <div v-else class="row">
    <draggable
      class="list-group containers"
      :list="lists"
      group="column"
      @end="updateColumnsIndex(lists)"
      @add="updateColumnsIndex(lists)"
      @remove="updateColumnsIndex(lists)"
    >
      <div class="list-for" v-for="(list, index) in lists" :key="index">
        <div class="list-container">
          <div class="col-3">
            <div style="display: flex; align-items: baseline">
              <h4
                @click="list.fixingTitle = isAdmin"
                class="column-name"
                v-if="list.fixingTitle === false"
              >
                {{ list.name }}
              </h4>
              <input
                @keydown.enter="fixListTitle(list)"
                v-else
                v-model="list.name"
                class="column-name"
                placeholder="제목"
              />
              <span
                @click="list.fixingPercentage = isAdmin"
                style="color: #7f7f7f"
                class="progress"
                v-if="list.fixingPercentage === false"
                >진척도 {{ list.percentage_progress }}</span
              >
              <input
                type="number"
                @keydown.enter="fixPercentage(list)"
                class="progress"
                v-else
                v-model="list.percentage_progress"
                placeholder="진척도"
              />
              <vs-button
                circle
                icon
                dark
                transparent
                style="margin-left: auto"
                v-if="list.adding === false && list.fixingTitle === false"
                :disabled="!isAdmin && !isParticipant"
                @click="list.adding = true"
              >
                <i class="bx bx-plus" />
              </vs-button>
              <vs-button
                circle
                icon
                transparent
                style="margin-left: auto"
                @click="list.fixingTitle = false"
                v-if="list.adding === false && list.fixingTitle === true"
              >
                <i class="bx bx-check" />
              </vs-button>
            </div>
            <div class="list-card">
              <card v-if="list.adding === true">
                <template #hero>
                  {{fileName}}
                  <div class="file-upload">
                  <input
                    id="fileUpload"
                    type="file"
                    @change="handleFileChange"
                    hidden
                  />
                  <br/>
                  <vs-button
                    class="file-upload-button"
                    @click="chooseFiles"
                  >
                  Image File upload
                  </vs-button>
                  </div>
                </template>
                <template #body>
                  <img v-if="uploadingFileUrl" :src="uploadingFileUrl" />
                  <vs-input
                    type="text"
                    v-model="list.addTitle"
                    class="add-card-body"
                    placeholder="제목"
                  />
                  <vs-input
                    type="text"
                    v-model="list.addContent"
                    placeholder="내용"
                  />
                </template>
                <template #tailing>
                  <div style="display: flex; justify-content: flex-end">
                    <vs-button
                      type="filled"
                      color="primary"
                      v-on:click="addCard(list.id, list.addTitle, list.addContent, list.cards.length)"
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
              <draggable
                class="list-group"
                :list="list.cards"
                group="card"
                @end="updateCardsIndex(list)"
                @add="updateCardsIndex(list)"
                @remove="updateCardsIndex(list)"
              >
                <div v-for="element in list.cards" :key="element.id">
                  <Task
                    style="max-width: 300px"
                    v-bind:element="{ ...element }"
                    v-bind:refetch="refetch"
                    v-bind:tagList="tags"
                    v-bind:users="users"
                  />
                </div>
              </draggable>
            </div>
          </div>
        </div>
      </div>

      <div class="column-adder">
        <!-- <Toast v-if="showToast"/> -->
        <vs-button
          style="margin-top: calc(23px)"
          icon
          transparent
          flat
          class="add-button"
          type="filled"
          color="dark"
          v-if="addingColumn === false"
          :disabled="!isAdmin && !isParticipant"
          @click="addingColumn = true"
          ><i class="bx bx-plus"></i
        ></vs-button>
        <div class="list-for" v-if="addingColumn">
          <div class="list-container">
            <div class="col-3">
              <div style="display: flex; align-items: baseline">
                <input
                  v-model="addColumnTitle"
                  class="column-name"
                  placeholder="제목"
                />
                <vs-button
                  circle
                  icon
                  transparent
                  @click="addColumn(addColumnTitle)"
                >
                  <i class="bx bx-check" />
                </vs-button>
                <vs-button
                  circle
                  icon
                  danger
                  transparent
                  v-model="addColumnTitle"
                  @click="addColumnClear"
                >
                  <i class="bx bx-x" />
                </vs-button>
              </div>
              <div class="list-card" />
            </div>
          </div>
        </div>
      </div>
    </draggable>
    <vs-dialog style="z-index: 1000" v-model="setPermission">
      <template #header>
        <h3 class="not-margin">권한 관리</h3>
      </template>
      <div class="con-form">
        <div style="display: flex; align-items: center">
          <h4 style="text-align: left">관리자</h4>
          <vs-tooltip>
            <md-icon style="margin: 0px; margin-left: 8px"
              >help_outline</md-icon
            >
            <template #tooltip>
              해당 보드에 관한 모든 권한을 갖습니다. 보드를 생성하신 사용자님은
              기본적으로 관리자입니다.
            </template>
          </vs-tooltip>
        </div>
        <div class="users">
          <div
            v-for="(user, index) in admins"
            :key="user.id"
            style="position: relative; height: 44px; width: 44px"
          >
            <vs-tooltip>
              <vs-avatar
                style="position: absolute"
                v-if="user.thumbnail === null"
              >
                <template #text>
                  {{ getInitial(user.name || "") }}
                </template>
              </vs-avatar>
              <vs-avatar style="position: absolute" v-else>
                <img :src="user.thumbnail" alt="" />
              </vs-avatar>
              <template #tooltip>
                {{ user.name }}
              </template>
            </vs-tooltip>
            <vs-button
              @click.stop="deleteUser('admin', index)"
              @mouseenter.stop
              size="mini"
              style="
                position: absolute;
                top: -8px;
                right: -10px;
                height: 16px;
                width: 16px;
              "
              circle
              icon
              danger
              floating
            >
              <i class="bx bx-x"></i>
            </vs-button>
          </div>
        </div>
        <el-autocomplete
          class="inline-input"
          v-model="newAdminQuery"
          :fetch-suggestions="querySearch"
          placeholder="새 관리자 검색..."
          @select="(value) => handleSelect(value, 'admin')"
        />
        <div style="display: flex; align-items: center">
          <h4 style="text-align: left">참여자</h4>
          <vs-tooltip>
            <md-icon style="margin: 0px; margin-left: 8px"
              >help_outline</md-icon
            >
            <template #tooltip>
              해당 보드에 관한 일부 권한을 갖습니다. 보드 삭제, 칼럼 이름 변경
              등이 제한됩니다.
            </template>
          </vs-tooltip>
        </div>
        <div class="users">
          <div
            v-for="(user, index) in participants"
            :key="user.id"
            style="position: relative; height: 44px; width: 44px"
          >
            <vs-tooltip>
              <vs-avatar
                style="position: absolute"
                v-if="user.thumbnail === null"
              >
                <template #text>
                  {{ getInitial(user.name || "") }}
                </template>
              </vs-avatar>
              <vs-avatar style="position: absolute" v-else>
                <img :src="user.thumbnail" alt="" />
              </vs-avatar>
              <template #tooltip>
                {{ user.name }}
              </template>
            </vs-tooltip>
            <vs-button
              @click.stop="deleteUser('participants', index)"
              @mouseenter.stop
              size="mini"
              style="
                position: absolute;
                top: -8px;
                right: -10px;
                height: 16px;
                width: 16px;
              "
              circle
              icon
              danger
              floating
            >
              <i class="bx bx-x"></i>
            </vs-button>
          </div>
        </div>
        <el-autocomplete
          class="inline-input"
          v-model="newParticipantsQuery"
          :fetch-suggestions="querySearch"
          placeholder="새 참여자 검색..."
          @select="(value) => handleSelect(value, 'participants')"
        />
      </div>
      <template #footer>
        <div class="con-footer">
          <vs-button @click="updatePermissions" transparent> OK </vs-button>
          <vs-button @click="setPermission = false" dark transparent>
            Cancel
          </vs-button>
        </div>
      </template>
    </vs-dialog>

    <md-button
      class="md-fab set-permission"
      id="set-permission"
      @click="setPermission = true"
      :disabled="!isAdmin"
    >
      <md-icon>settings</md-icon>
    </md-button>
  </div>
</template>

<style lang="scss" scoped>

.file-upload {
  align-content: center;
  display: flex;
  justify-content: center;
}

.file-upload-button {
  width: 80%;
  text-align: center;
}

.add-card-body {
  margin-top: 10px;
  margin-bottom: 10px;
}

.set-permission {
  position: fixed;
  bottom: 30px;
  right: 30px;
}
.not-margin {
  margin: 0px;
  padding: 10px;
}
.user-avatar {
  margin: 8px;
}
.users {
  display: flex;
  min-height: 60px;
  max-width: 368px;
  flex-wrap: wrap;
}
.con-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
.column-name {
  text-align: left;
  padding-left: 10px;
  margin: 18.62px 0px;
  margin-top: 18.62px;
  height: 20px;
  padding: 0px 0px 0px 10px;
  font-family: Noto Sans KR, Helvetica;
  background-color: transparent;
  border: 0px;
  width: calc(100% - 140px);
  font-weight: bold;
  border: 1px solid transparent;
}
.column-name:hover {
  border: 1px solid #dddddd;
  border-radius: 8px;
}
.col-3 {
  width: 300px;
}
.list-for {
  width: 340px;
}
.add-button {
  outline-style: dashed;
  outline-color: grey;
  color: grey;
  height: 100vh;
  width: 22px;
  outline-width: thin;
  border-radius: 0%;
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
.progress {
  font-size: 12px;
  width: 100px;
  text-align: left;
  padding-left: 10px;
  border: 1px solid transparent;
  background-color: transparent;
}
.progress:hover {
  border: 1px solid #dddddd;
  border-radius: 6px;
}
.column-adder {
  min-width: 110px;
}

#line {
  -webkit-column-rule-style: solid;
  -moz-column-rule-style: solid;
  column-rule-style: solid;
}

// .vs-button{
// }
</style>

<script>
import draggable from "vuedraggable";
import gql from "graphql-tag";
import Task from "../components/Task";
import card from "../components/Card.vue";

export default {
  name: "two-lists",
  display: "Two Lists",
  order: 1,
  computed: {
    currentUser() {
      return this.$store.state;
    },
  },
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
      tags: [],
      users: [],
      admins: [],
      participants: [],
      isAdmin: false,
      isParticipant: false,
      newAdminQuery: "",
      newParticipantsQuery: "",
      setPermission: false,
      fileName: "",
      uploadingFile: null, 
      uploadingFileUrl: "", 
    };
  },
  beforeDestroy: function () {
    this.loading.close();
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
          columns(where: { board_id: { _eq: $id } }, order_by: { index: asc }) {
            id
            name
            percentage_progress
            cards(order_by: { index: asc }) {
              card_description {
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
              user_card_taggings {
                user {
                  id
                  name
                  thumbnail
                }
              }
              index
            }
          }

          tag(where: { board_id: { _eq: $id } }) {
            id
            tag
          }

          boards_user(
            where: { board_id: { _eq: $id } }
            order_by: { kind: asc }
          ) {
            kind
            id
            thumbnail
            email
            name
            board_id
          }

          user {
            email
            id
            name
            naver_id
            nickname
            thumbnail
          }

          boards_by_pk(id: $id) {
            admins
            participants
          }
        }
      `,
      update(data) {
        this.loading.close();
        console.log("updated");
        this.$data.tags = data.tag;
        this.$data.users = data.boards_user;
        this.$data.totalUsers = data.user;
        if (!this.setPermission) {
          this.$data.admins = data.boards_user.filter((e) => e.kind == "admin");
          this.$data.participants = data.boards_user.filter(
            (e) => e.kind == "participants"
          );
        }
        this.initPermissions(this.$data.admins, this.$data.participants);
        return data.columns.map((e) => ({
          adding: false,
          addTitle: "",
          addContent: "",
          fixingTitle: false,
          fixingPercentage: false,
          ...e,
        }));
      },
    },
  },
  methods: {
    async fixPercentage(list) {
      if (!list.percentage_progress) {
        return;
      } else if (parseInt(list.percentage_progress) < 0) {
        list.percentage_progress = 0;
      } else if (parseInt(list.percentage_progress) > 100) {
        list.percentage_progress = 100;
      }
      await this.$apollo.mutate({
        variables: {
          percenage: parseInt(list.percentage_progress),
          id: list.id,
        },
        mutation: gql`
          mutation ($percenage: Int, $id: Int!) {
            update_columns_by_pk(
              pk_columns: { id: $id }
              _set: { percentage_progress: $percenage }
            ) {
              id
            }
          }
        `,
      });
      list.fixingPercentage = false;
    },
    async fixListTitle(list) {
      await this.$apollo.mutate({
        variables: {
          name: list.name,
          id: list.id,
        },
        mutation: gql`
          mutation ($name: String!, $id: Int!) {
            update_columns_by_pk(
              pk_columns: { id: $id }
              _set: { name: $name }
            ) {
              id
            }
          }
        `,
      });
      list.fixingTitle = false;
    },
    replace: function () {
      this.list = [{ name: "Edgard" }];
    },
    clone: function (el) {
      return {
        name: el.name + " cloned",
      };
    },
    addCard: async function (list_id, title, content, index) {
      const userId = this.currentUser.id;
      console.log(index);

      await this.$apollo.mutate({
        mutation: gql`
          mutation addCard($list_id: Int!, $title: String!, $content: String!, $user_id: Int!, $index: Int!) {
            insert_card_description(
              objects: [
                {
                  card: { data: { created_by_user_id: $user_id, column_id: $list_id, index: $index } }
                  title: $title
                  content: $content
                  user_id: $user_id
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
          title,
          content,
          user_id: userId,
          index,
        },
      });
      this.$apollo.queries.lists.refetch();
    },
    updateCardIndex: async function (cardId, index, columnId) {
      await this.$apollo.mutate({
        mutation: gql`
          mutation updateCardIndex(
            $card_id: Int!
            $index: Int!
            $column_id: Int!
          ) {
            update_card(
              where: { id: { _eq: $card_id } }
              _set: { index: $index, column_id: $column_id }
            ) {
              returning {
                id
              }
            }
          }
        `,
        variables: {
          card_id: cardId,
          index,
          column_id: columnId,
        },
      });
    },
    addColumnClear: function () {
      this.addingColumn = false;
      this.addColumnTitle = "";
    },
    addColumn: async function (boardName) {
      const boardId = this.$route.params.id;
      const columnLength = this.lists.length + 1;
      //TODO : modify user id
      const { data } = await this.$apollo.mutate({
        mutation: gql`
          mutation addColumn($board_id: Int!, $name: String!, $index: Int!) {
            insert_columns_one(
              object: { board_id: $board_id, name: $name, index: $index }
            ) {
              id
              name
              percentage_progress
              cards(order_by: { index: asc }) {
                card_description {
                  card_id
                  title
                  content
                  image
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
                user_card_taggings {
                  user {
                    id
                    name
                    thumbnail
                  }
                }
                index
              }
            }
          }
        `,
        variables: {
          board_id: boardId,
          name: boardName,
          index: columnLength,
        },
      });
      console.log(data);
      this.$data.addingColumn = false;
      this.lists.push(data.insert_columns_one);
    },
    updateColumnIndex: async function (columnId, index) {
      await this.$apollo.mutate({
        mutation: gql`
          mutation updateColumnIndex($column_id: Int!, $index: Int!) {
            update_columns(
              where: { id: { _eq: $column_id } }
              _set: { index: $index }
            ) {
              returning {
                id
              }
            }
          }
        `,
        variables: {
          index,
          column_id: columnId,
        },
      });
    },
    updateColumnsIndex: async function (lists) {
      console.log(lists);
      const updatePromises = lists.map((e, index) => {
        return this.updateColumnIndex(e.id, index);
      });

      await Promise.all(updatePromises);
    },
    updateCardsIndex: async function (list) {
      const updatePromises = list.cards.map((e, index) => {
        console.log(e.id, index, list.id);
        return this.updateCardIndex(e.id, index, list.id);
      });

      await Promise.all(updatePromises);
    },
    refetch: function () {
      this.$apollo.queries.lists.refetch();
    },
    initPermissions: function (admins, participants) {
      if (this.$store.state.loggedIn) {
        this.$data.isAdmin = admins
          .map((e) => e.id)
          .includes(this.$store.state.id);
        this.$data.isParticipant = participants
          .map((e) => e.id)
          .includes(this.$store.state.id);
      } else {
        this.$data.isAdmin = false;
        this.$data.isParticipant = false;
      }
    },
    handleSelect(value, kind) {
      if (kind === "admin") {
        this.newAdminQuery = "";
        this.admins.push(value);
      } else {
        this.newParticipantsQuery = "";
        this.participants.push(value);
      }
    },
    deleteUser(kind, index) {
      (kind === "admin" ? this.admins : this.participants)[
        index
      ].deleted = true;
      (kind === "admin" ? this.admins : this.participants).splice(index, 1);
      // const Stickedtooltips = document.querySelectorAll(".vs-tooltip");
      // for (const tooltip of Stickedtooltips) {
      //   tooltip.remove();
      // }
    },
    async querySearch(queryString, callback) {
      const {
        data: { user },
      } = await this.$apollo.query({
        variables: {
          queryString: `%${queryString}%`,
          ids: []
            .concat(this.participants)
            .concat(this.admins)
            .map((user) => user.id),
        },
        query: gql`
          query ($ids: [Int!]!, $queryString: String!) {
            user(
              where: {
                id: { _nin: $ids }
                _or: [
                  { name: { _ilike: $queryString } }
                  { email: { _ilike: $queryString } }
                ]
              }
              limit: 3
            ) {
              id
              name
              email
              thumbnail
            }
          }
        `,
      });
      console.log(user);
      callback(
        user.map((user) => ({
          ...user,
          value: `${user.name} (${user.email ?? "이메일 없음"})`,
        }))
      );
    },
    getInitial(name) {
      return name
        .split(" ")
        .map((part) => part.charAt(0))
        .slice(0, 2)
        .join();
    },
    async updatePermissions() {
      const adminIds = this.admins.map((e) => e.id);
      const participantIds = this.participants.map((e) => e.id);
      const boardId = this.$route.params.id;
      await this.$apollo.mutate({
        mutation: gql`
          mutation updateBoardPermissions(
            $board_id: Int!
            $admins: jsonb!
            $participants: jsonb!
          ) {
            update_boards_by_pk(
              pk_columns: { id: $board_id }
              _set: { admins: $admins, participants: $participants }
            ) {
              id
            }
          }
        `,
        variables: {
          board_id: boardId,
          admins: adminIds,
          participants: participantIds,
        },
      });
      this.setPermission = false;
    },
    handleFileChange(e) {
      this.fileName = e.target.files[0].name;
      this.uploadingFile = e.target.files[0];
      this.uploadingFileUrl = URL.createObjectURL(e.target.files[0]);
    },
    chooseFiles() {
      document.getElementById("fileUpload").click();
    },
  },
};
</script>