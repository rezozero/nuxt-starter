# Blocks

The components in this directory will be auto imported globally.  
The names need to match exactly the Roadiz block names.


## Template
```vue
<script lang="ts">
    import Block from "~/mixins/Block";
    import mixins from "vue-typed-mixins";

    export default mixins(Block).extend({})
</script>
```
