<template>
  <div>
    <draggable v-model="myArray" group="people" @start="drag=true" @end="drag=false">
      <div v-for="element in myArray" :key="element.id">{{element.name}}</div>
  </draggable>
  </div>
</template>
<script>
import draggable from 'vuedraggable'

export default {
  data: function () {
    return {
      myArray: [{
        id: 1,
        name: "임준세"
      },
      {
        id: 2,
        name: "이명준"
      },
      {
        id: 3,
        name: "이준혁"
      }]
    }
  },
  components: {
    draggable
  }
}
</script>