import wrap from '../src/wrap-ast-transformation'
import type { ASTTransformation } from '../src/wrap-ast-transformation'

import { transformAST as createAppMount } from './create-app-mount'
import { transformAST as rootPropToUse } from './root-prop-to-use'
import { transformAST as removeTrivialRoot } from './remove-trivial-root'
import { transformAST as removeProductionTip } from './remove-production-tip'
import { transformAST as removeVueUse } from './remove-vue-use'
import { transformAST as removeContextualHFromRender } from './remove-contextual-h-from-render'

import { transformAST as removeExtraneousImport } from './remove-extraneous-import'

export const transformAST: ASTTransformation = (context) => {
  createAppMount(context)
  rootPropToUse(context, { rootPropName: 'store' })
  rootPropToUse(context, { rootPropName: 'router' })
  removeTrivialRoot(context)
  removeProductionTip(context)
  removeVueUse(context)
  removeContextualHFromRender(context)

  removeExtraneousImport(context, { localName: 'Vue' })
  removeExtraneousImport(context, { localName: 'Vuex' })
  removeExtraneousImport(context, { localName: 'VueRouter' })
}

export default wrap(transformAST)
export const parser = 'babylon'
