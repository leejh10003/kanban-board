<template>
  <div id="container">
    <div class="card-link" href="#">
      <article class="blog-card" @click.stop="click">
        <div class="article-border">
          <slot  name="hero">
          </slot>
          <div class="article-details">
            <slot name="title" class="post-title"/>
            <slot name="body"/>
          </div>
        </div>
        <slot name="tailing" class="post-author"/>
      </article>
    </div>
</div>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Roboto:400,700');

$bg: #eedfcc;
$text: #777;
$black: #121212;
$white: #fff;
$red: #e04f62;
$border: #ebebeb;
$shadow: rgba(0, 0, 0, 0.2);

@mixin transition($args...) {
  transition: $args;
}


#container {
  display: inline-block;
  width: calc(100% - 20px);
  padding: 10px;
}

.blog-card {
  background: #f0f0f0; //Change this
  box-shadow: 0 2px 2px 1px $shadow;
  border-radius: 0.375rem;
  display: flow-root;
  //padding-top: 0.3rem;
}

.article-border {
  background: white; //Change this
  border-radius: 0.375rem;
  margin: 5px; //Change this
  padding: 0.5rem; //Change this
}

.card-link {
  display: block;
  color: inherit;
  text-decoration: none;
  &:hover .hero {
    @include transition(opacity 0.3s ease);
    opacity: 0.9;
  }
}

.hero {
  @include transition(opacity 0.3s ease);
  width: 100%;
  height: 200px;
	object-fit: cover;
}

.article-details {
  text-align: left;
  margin: 10px;
}

.post-title {
  @include transition(color 0.3s ease);
  font-size: 1.125rem;
  line-height: 1.4;
  color: $black;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  &:hover {
    @include transition(color 0.3s ease);
    color: $red;
  }
}

.post-author {
  font-size: 0.875rem;
  line-height: 1;
  padding: 0 0 0.3rem 0.3rem;
  // border-top: 0.0625rem solid $border;
}
</style>

<script>

export default {
  name: "card",
  display: "Card",
  methods: {
    click(){
      this.$emit('click')
    }
  }
};
</script>