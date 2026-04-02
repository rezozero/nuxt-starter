<template>
    <span :class="$style.root">
        <VIcon
            name="check"
            :class="$style.icon"
        />
    </span>
</template>

<style lang="scss" module>
@use '~/assets/scss/functions/ease' as *;

.root {
    position: relative;
    display: inline-flex;
    width: var(--v-checkbox-size, 16px);
    height: var(--v-checkbox-size, 16px);
    align-items: center;
    justify-content: center;
    border: 2PX solid currentcolor;

    input[type='radio'] + & {
        border-radius: 50vmax;

        --v-checkbox-hover-border-radius: 50vmax;
    }

    input[type='checkbox'] + & {
        border-radius: var(--v-checkbox-border-radius, 2PX);

        --v-checkbox-hover-border-radius: var(--form-control-border-radius, 0);
    }

    input:checked + & {
        background-color: currentcolor;
    }

    input:focus-visible + & {
        outline: 2px solid currentcolor;
        outline-offset: 2px;
    }

    input:disabled + & {
        border-color: var(--form-checkbox-radio-on-light-border-disabled, #BFBFBF);
    }

    @media (hover:hover) {
        input:not(:disabled):hover + &::before {
            background-color: var(--form-checkbox-radio-on-light-bg-hover, #E5E5E5);
        }
    }

    // Hover element
    input + &::before {
        position: absolute;
        z-index: -1;
        border-radius: var(--v-checkbox-hover-border-radius);
        content: '';
        inset: -7px;
        transition: background-color 0.3s ease(out-quad);
    }

    // Radio check shape
    input[type='radio'] + &::after {
        width: max(var(--v-checkbox-size, 18px) / 3, 6px);
        height: max(var(--v-checkbox-size, 18px) / 3, 6px);
        border-radius: inherit;
        content: '';
    }

    input[type='radio']:checked + &::after {
        background-color: #fff;
    }
}

.icon {
    position: absolute;
    color: var(--surface-light-primary, #FFF);
    font-size: var(--v-input-font-size, 24px);
    visibility: hidden;

    :global(input)[type='checkbox']:checked + .root & {
        visibility: inherit;
    }
}
</style>
