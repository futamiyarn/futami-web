<svelte:options
  customElement={{
    tag: "f-a",
    shadow: "none",
  }}
/>

<script lang="ts">
  import type { IconPrefix, IconName } from "@fortawesome/fontawesome-svg-core";
  import * as fa from "../util/font-awesome";

  export let type;
  export let name: IconName;
  export let fixed;

  if (!type || !name) throw new Error("type and name is required lol!");

  let prefix: IconPrefix =
    type === "brand" ? "fab" : type === "regular" ? "far" : "fas";

  let icon: string = fa.icon({ prefix, iconName: name }).html[0];

  const getClass = /(class="(\s|\S)*?)(")/;

  if (fixed === "")
    icon = icon.replace(getClass, `${icon.match(getClass)![1]} fa-fw"`);

  // Get this web component
</script>

{@html icon}
