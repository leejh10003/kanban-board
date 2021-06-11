<template>
  <div id="container">
    <div class="card-link" href="#">
      <article class="blog-card">
        <div class="article-border">
          <slot name="hero">
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

* {
  box-sizing: border-box;
  &::before, &::after {
    box-sizing: border-box;
  }
}

body {
  display: flex;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  color: $text;
  font-size: 0.9375rem;
  min-height: 100vh;
  line-height: 1.6;
  align-items: center;
  justify-content: center;
  text-rendering: optimizeLegibility;
}

#container {
  width: 400px;
  height: 100%;
  padding: 10px;
}

.blog-card {
  background: #f0f0f0; //Change this
  box-shadow: 0 0.1875rem 1.5rem $shadow;
  border-radius: 0.375rem;
  //padding-top: 0.3rem;
}

.article-border {
  background: white; //Change this
  border-radius: 0.375rem;
  margin: 1rem; //Change this
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
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-bottom: 1rem;
  padding-top: 1rem;
  text-align: left;
}

.post-category {
  display: inline-block;
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.0625rem;
  margin: 0 0 0.75rem 0;
  padding: 0 0 0.25rem 0;
  border-bottom: 0.125rem solid $border;
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
  display: flex;
  font-size: 0.875rem;
  line-height: 1;
  padding: 0 0 0.3rem 0.3rem;
  // border-top: 0.0625rem solid $border;
}

@media (max-width: 40rem) {
  #container {
    width: 18rem;
    height: 27.25rem;
  }
  
  .blog-card {
  }
}

@supports (display: grid) {
  body {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 0.625rem;
    grid-template-areas: ". main main ." ". main main .";
  }
  
  #container {
    grid-area: main;
    align-self: center;
    justify-self: center;
  }

  .hero {
  }
  
  .blog-card {
    grid-template-columns: 1fr 2fr;
    grid-template-rows: 1fr;
  }
  
  @media (max-width: 40rem) {
    .blog-card {
      grid-template-columns: auto;
      grid-template-rows: 12rem 1fr;
    }
  }
}
</style>

<script>

export default {
  name: "card",
  display: "Card",
};
</script>