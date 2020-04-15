# vue-codemod

**Current status: experimental**

This repository contains a collection of codemod scripts for use with [JSCodeshift](https://github.com/facebook/jscodeshift) that help update Vue.js APIs.

Inspired by [react-codemod](https://github.com/reactjs/react-codemod).

## Command Line Usage

`npx vue-codemod <path> -t <transformation> --params [transformation params] [...additional options]`

- `transformation` (required) - name of transformation, see available transformations below; or you can provide a path to a custom transformation module.
- `path` (required) - files or directory to transform.
- `--params` (optional) - additional transformation specific args.
<!-- - use the `--dry` options for a dry-run. -->

## Programmatic API

- `runTransformation(fileInfo, transformation, params)`

## Roadmap

- [x] Basic testing setup and a dummy CLI
- [x] Support applying `jscodeshift` codemods to `.vue` files
- [x] Provide a programmatic interface for usage in `vue-cli-plugin-vue-next`
- [ ] Implement more transformations for [active RFCs](https://github.com/vuejs/rfcs/tree/master/active-rfcs)
- [ ] Support TypeScript
- [ ] Define an interface for transformation of template blocks
- [ ] A playground for writing transformations

## Included Transformations

### Migrating from Vue 2 to Vue 3

> Note: even though most of the migration process can be automated, please be aware there might still be subtle differences between Vue 3 and Vue 2 runtime, please double check before deploying your Vue 3 app into production.

#### Fixable in ESLint

- [RFC05: Replace `v-bind`'s `.sync` with a `v-model` argument](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0005-replace-v-bind-sync-with-v-model-argument.md)
  - Can be detected and fixed by the [`vue/no-deprecated-v-bind-sync`](https://eslint.vuejs.org/rules/no-deprecated-v-bind-sync.html) ESLint rule
- [RFC19: Remove `data` object declaration](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0019-remove-data-object-declaration.md)
  - Can be detected and fixed by the [`vue/no-shared-component-data`](https://eslint.vuejs.org/rules/no-shared-component-data.html) ESLint rule

#### Codemods

- [RFC04: Global API treeshaking](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0004-global-api-treeshaking.md) & [RFC09: Global mounting/configuration API change](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0009-global-api-change.md)
  - `import Vue from 'vue'` -> `import * as Vue from 'vue'`
  - `Vue.extend` and `new Vue` -> `defineComponent`
    - `Vue.extend` can be supported in a compat runtime as an alias to `defineComponent` (Need to propose an RFC)
  - `new HelloWorld().$mount` -> `createApp(HelloWorld).$mount`
  - `render(h)` -> `render()` and `import { h } from 'vue'`
  - `Vue.config`, `Vue.use`, `Vue.mixin`, `Vue.component`, `Vue.directive`, etc
    - -> `app.**`
    - Maybe we can provide a runtime compatibility layer for apps with one single root instance? (Need to propose an RFC)
  - `Vue.prototype.customProperty` -> `app.config.globalProperties.customProperty`
    - Again, a runtime compatibility layer is possible
  - `Vue.config.productionTip` -> removed
  - `Vue.config.ignoredElements` -> `app.config.isCustomElement`
  - Detect and warn on `optionMergeStrategies` behavior change
- [RFC06: Slots unification](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0006-slots-unification.md)
  1. During the transition period, should warn users when they use `this.$slots`, recommending `this.$scopedSlots` as a replacement
  2. Transform all `this.$slots` to `this.$scopedSlots` with an inline warning comment
  3. Replace all this.$scopedSlots occurrences with this.$slots
- [RFC07: Functional and async components API change](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0007-functional-async-api-change.md)
  - Note: a PR is proposed to amend this RFC: https://github.com/vuejs/rfcs/pull/154
  - TODO
- [RFC08: Render function API change](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0008-render-function-api-change.md)
  - TODO
- [RFC11: Component `v-model` API change](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0011-v-model-api-change.md)
  - TODO
- [RFC12: Custom directive API change](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0012-custom-directive-api-change.md)
  - TODO
- [RFC13: Composition API](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0013-composition-api.md)
  - `import ... from '@vue/composition-api'` -> `import ... from 'vue'`
  - TODO: Other subtle differences between `@vue/composition-api` and the Vue 3 implementation.
- [RFC14: Remove `keyCode` support in `v-on`](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0014-drop-keycode-support.md)
  - TODO
- [RFC16: Remove `inline-template`](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0016-remove-inline-templates.md)
  - TODO
- [RFC18: Transition class name adjustments](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0018-transition-class-change.md)
  - TODO
- [RFC24: Attribute coercion behavior change](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0024-attribute-coercion-behavior.md)
  - Codemod is not likely to help in this case
- [RFC25: Built-in `<Teleport>` component](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0025-teleport.md)
  - Detect all the presence of `teleport` components, renaming them to some other name like `TeleportComp`
- [RFC26: New async component API](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0026-async-component-api.md)
  - TODO
- [RFC27: Custom Elements Interop Improvements](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0027-custom-elements-interop.md)
  - TODO
- [Vuex 3.x to 4](https://github.com/vuejs/vuex/tree/4.0)
  - `Vue.use(Vuex)` & `new Vue({ store })` -> `app.use(store)`
  - `new Store()` -> `createStore()`
- [Vue Router 3.x to 4](https://github.com/vuejs/vue-router-next)
  - `Vue.use(VueRouter)` & `new Vue({ router })` -> `app.use(router)`
  - `new VueRouter()` -> `createRouter()`
  - `mode: 'history', base: BASE_URL` etc. -> `history: createWebHistory(BASE_URL)` etc.
  - [RFC21: Scoped slot API for `router-link`](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0021-router-link-scoped-slot.md)
    - TODO
- [`vue-class-component` 7.x to 8](https://github.com/vuejs/vue-class-component/issues/406)
  - TODO

#### Breaking Changes that Can Only Be Manually Migrated

- [RFC17: Changed behavior when using `transition` as root](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0017-transition-as-root.md)
  - There will be a new rule in the ESLint plugin to detect the unsupported pattern
- [RFC22: Merge `meta` fields from parent to child in `RouteLocation`](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0022-router-merge-meta-routelocation.md)
  - Seems no codemod or ESLint rule is applicable to this breaking change

#### Other Opt-In Changes

These features are only deprecated but still supported in the compatiblity builds.
There will be runtime warnings and ESLint rules to detect their usages.
Some of them can be automatically migrated with the help of codemods.

- [RFC15: Remove filters](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0015-remove-filters.md)
  - Can be detected by the [`vue/no-deprecated-filter`](https://eslint.vuejs.org/rules/no-deprecated-filter.html) ESLint rule
- [RFC20: Events API Change](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0020-events-api-change.md)
  - Can be detected by the [`vue/no-deprecated-events-api`](https://github.com/vuejs/eslint-plugin-vue/pull/1097) ESLint rule
  - A codemod can be implemented to use other libraries like [tiny-emitter](https://github.com/scottcorgan/tiny-emitter) for the events API
- [RFC23-scoped-styles-changes](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0023-scoped-styles-changes.md)
  - The new behavior should be opt-in

## Custom Transformation

See https://github.com/facebook/jscodeshift#transform-module

## Post Transformation

- Running transformations will generally ruin the formatting of your files. A recommended way to solve that problem is by using [Prettier](https://prettier.io/) or `eslint --fix`.
- Even after running prettier its possible to have unnecessary new lines added/removed. This can be solved by ignoring white spaces while staging the changes in git.

```sh
git diff --ignore-blank-lines | git apply --cached
```
