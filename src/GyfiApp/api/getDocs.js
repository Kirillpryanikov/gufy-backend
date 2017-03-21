/* eslint-disable */
import getUserDocs from './user/user.docs'
import getAuthDocs from './auth/auth.docs'
import getProductDocs from './product/product.docs'
import getCategoryDocs from './category/category.docs'
import getActionDocs from './action/action.docs'
import getTicketDocs from './ticket/ticket.docs'
import getWallDocs from './wall/wall.docs'
import getPostDocs from './post/post.docs'
// import getActionDocs from './action/action.docs'
export default function getDocs(ctx, params) {
  const userDocs = getUserDocs(ctx)
  const authDocs = getAuthDocs(ctx, userDocs)
  const productDocs = getProductDocs(ctx)
  const categoryDocs = getCategoryDocs(ctx)
  const actionDocs = getActionDocs(ctx)
  const ticketDocs = getTicketDocs(ctx)
  const wallDocs = getWallDocs(ctx)
  const postDocs = getPostDocs(ctx)
  const docs = Object.assign({
    "swagger": "2.0",
    "info": {
      "title": "GyfiAPI",
      "version": "1.0.0"
    },
    "schemes": [
      ctx.config.protocol,
    ],
    "basePath": "/v1",
    "produces": ["application/json"],
    "paths": Object.assign(userDocs.paths, authDocs.paths, productDocs.paths, categoryDocs.paths, actionDocs.paths, ticketDocs.paths, wallDocs.paths, postDocs.paths),
    "definitions": Object.assign(userDocs.definitions, authDocs.definitions, productDocs.definitions, categoryDocs.definitions, actionDocs.definitions, ticketDocs.definitions, wallDocs.definitions, postDocs.definitions)

  }, params)
  return docs
}
