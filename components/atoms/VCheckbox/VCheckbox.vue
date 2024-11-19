<template>
    <span :class="$style.root">
        <VIcon
            name="check"
            :class="$style.icon"
        />
    </span>
</template>

<style lang="scss" module>
@use "assets/scss/functions/rem" as *;

$check-border-width: 2px;

.root {
    position: relative;
    display: flex;
    width: rem(18);
    height: rem(18);
    align-items: center;
    justify-content: center;
    border: $check-border-width solid currentColor;
    color: inherit;

    :global(input):checked + & {
        background-color: currentcolor;
    }

    :global(input)[type='radio'] + & {
        border-radius: 50%;
    }

    :global(input)[type='radio'] + &::after {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: rgb(255 255 255);
        content: '';
    }
}

.icon {
    $offset: rem(24 - 18 - $check-border-width * 0.5);

    position: absolute;
    top: -$offset;
    left: -$offset;
    color: rgb(255 255 255);
    visibility: hidden;

    :global(input)[type='checkbox']:checked + .root & {
        visibility: inherit;
    }
}
</style>
