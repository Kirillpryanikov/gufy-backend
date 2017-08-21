const jwt = require('jsonwebtoken');

export default(ctx) => {
  const { User, Wall, FreeGyfi, Values, Product, Action, Ticket, Post, ScratchGameHistory, Device, UserLike } = ctx.models
  // const { e400 } = ctx.models
  const { e403, e400 } = ctx.errors
  const { isAuth, _checkNotFound } = ctx.helpers
  const controller = {}
  controller.create = async function(req) {
    const params = req.allParams()
    const user = await User.create(params)
    await Wall.create({ userId: user.id })
    return user
  }
  controller.getMe = async function(req) {
    isAuth(req)
    const userId = req.user.id
    return User.findById(userId)
  }
  controller.getReferals = async function(req) {
    const params = req.allParams()
    const { id } = params
    const user = await User.findById(id).then(_checkNotFound('User'))
    return user.getReferals()
  }
  controller.products = async function(req) {
    const params = req.allParams()
    const { id } = params
    const user = await User.findById(id)
    const products = await user.getProducts()
    return products
  }
  controller.actions = async function(req) {
    const params = req.allParams()
    const { id } = params
    const user = await User.findById(id)
    const actions = await user.getActions()
    return actions
  }
  controller.tickets = async function(req) {
    const params = req.allParams()
    const { id } = params
    const user = await User.findById(id)
    const tickets = await user.getTickets()
    return tickets
  }
  controller.getWall = async function(req) {
    const params = req.allParams()
    const { id } = params
    const user = await User.findById(id)
    const wall = await user.getWall()
    const _wall = wall.toJSON()
    const posts = await wall.getPostsWithUsers()
    const _posts = posts.map(post => {
      const _post = post.toJSON()
      _post.user = post.user
      return _post
    })
    _wall.posts = _posts
    return _wall
  }
  // Поставить Like
  controller.setLike = async function(req) {
    isAuth(req)
    const params = req.allParams()
    const fromUserId = req.user.id
    const toUserId = params.id
    const user = await User.findById(fromUserId).then(_checkNotFound('User'))
    return user.setUserLike(toUserId)
  }
  // Убрать Like
  controller.removeLike = async function(req) {
    isAuth(req)
    const params = req.allParams()
    const fromUserId = req.user.id
    const toUserId = params.id
    const user = await User.findById(fromUserId).then(_checkNotFound('User'))
    return user.removeUserLike(toUserId)
  }
  // Поставить дизлайк
  controller.setDislike = async function(req) {
    isAuth(req)
    const params = req.allParams()
    const fromUserId = req.user.id
    const toUserId = params.id
    const user = await User.findById(fromUserId).then(_checkNotFound('User'))
    return user.setUserDislike(toUserId)
  }
  // Убрать дизлайк
  controller.removeDislike = async function(req) {
    isAuth(req)
    const params = req.allParams()
    const fromUserId = req.user.id
    const toUserId = params.id
    const user = await User.findById(fromUserId).then(_checkNotFound('User'))
    return user.removeUserDislike(toUserId)
  }

  controller.delete = async function(req) {
    const params = req.allParams()
    const { id } = params
    await Wall.destroy({
      where: {
        userId: id,
      },
    })
    await User.destroy({
      where: {
        id,
      },
    })
    return { status: 'success' }
  }

  controller.addSocialNetwork = async function(req) {
    isAuth(req)
    const userId = req.user.id
    const params = req.allParams()
    const { socialNetworkId, socialNetworkType, token } = params
    const user = await User.findById(userId)
    .then(_checkNotFound('User'))
    return user.addSocialNetwork(socialNetworkId, socialNetworkType, token)
  }
  controller.removeSocialNetwork = async function(req) {
    isAuth(req)
    const userId = req.user.id
    const params = req.allParams()
    const { socialNetworkType } = params
    const user = await User.findById(userId)
    .then(_checkNotFound('User'))
    return user.removeSocialNetwork(socialNetworkType)
  }

  controller.addDevice = async function(req) {
    isAuth(req)
    const params = req.allParams()
    const userId = req.user.id
    const user = await User.findById(userId)
    .then(_checkNotFound('User'))
    const fields = ['deviceId', 'token', 'type']
    for (const field of fields) {
      if (!params[field]) {
        throw e400(`${field} is not found`)
      }
    }
    return user.addNewDevice(params)
  }
  controller.getDevices = async (req) => {
    isAuth(req)
    const userId = req.user.id
    const user = await User.findById(userId)
    .then(_checkNotFound('User'))
    return user.getDevices()
  }
  controller.removeDevice = async (req) => {
    isAuth(req)
    const params = req.allParams()
    const userId = req.user.id
    const user = await User.findById(userId)
    .then(_checkNotFound('User'))
    const deviceParams = {}
    if (params.deviceId) {
      deviceParams.deviceId = params.deviceId
    }
    if (params.token) {
      deviceParams.token = params.token
    }
    return user.removeUserDevice(deviceParams)
  }

  controller.getLikesAndDislikes = async (req) => {
    isAuth(req)
    const params = req.allParams()
    const user = await User.findById(params.id)
    .then(_checkNotFound('User'))
    const [
      like,
      dislike,
    ] = await Promise.all([
      user.isLikedByUser(req.user.id),
      user.isDislikedByUser(req.user.id),
    ])
    return {
      like,
      dislike,
    }
  }

  controller.getFreeGyfiOnceInDay = async (req) => {
    isAuth(req);
    const token = req.headers['x-access-token'];
    const userObj = jwt.verify(token, ctx.config.jwt.secret);

    const user = await FreeGyfi.find({
      where: {
        userId: userObj.id,
        isVideoClip: false,
        date: {
          $gte: Date.now() - 86400000,
        },
      },
    });
    if (user) {
      throw e403("User already got free gyfi");
    } else {
      let userFind = await User.findById(userObj.id);
      const freeGyfi = await Values.find({
        where: {
          name: 'free-gyfi',
        }
      });
      await FreeGyfi.create({
        userId: userObj.id,
        count: parseInt(freeGyfi.value),
        date: Date.now()
      });
      userFind.gyfi += parseInt(freeGyfi.value);
      userFind.save();
    }
  };

  controller.getTimeFreeGyfi = async (req) => {
    isAuth(req);
    const token = req.headers['x-access-token'];
    const userObj = jwt.verify(token, ctx.config.jwt.secret);
    const time = await FreeGyfi.max('date', {
      where: {
        userId: userObj.id,
      },
    });

    return {
      date: new Date(time + 86400000),
    }
  };

  controller.getFreeGyfiBanner = async (req) => {
    isAuth(req);
    const token = req.headers['x-access-token'];
    const userObj = jwt.verify(token, ctx.config.jwt.secret);

    let userFind = await User.findById(userObj.id);
    const freeGyfi = await Values.find({
      where: {
        name: 'free-gyfi',
      }
    });
    await FreeGyfi.create({
      userId: userObj.id,
      isVideoClip: true,
      count: parseInt(freeGyfi.value),
      date: Date.now()
    });
    userFind.gyfi += parseInt(freeGyfi.value);
    userFind.save();
  }

  controller.removeUser = async (req) => {
    isAuth(req);
    const token = req.headers['x-access-token'];
    let userObj = jwt.verify(token, ctx.config.jwt.secret);

    if (userObj.role === 'admin') {
      const params = req.allParams();
      const { id } = params
      userObj.id = id
    }

    await User.destroy({
      where: {
        id: userObj.id,
      },
    });

    await Ticket.destroy({
      where: {
        userId: userObj.id,
      },
    });

    await Product.destroy({
      where: {
        ownerId: userObj.id,
      },
    });

    await Action.destroy({
      where: {
        ownerId: userObj.id,
      },
    });

    await Post.destroy({
      where: {
        userId: userObj.id,
      },
    });

    await ScratchGameHistory.destroy({
      where: {
        userId: userObj.id,
      },
    });

    await Device.destroy({
      where: {
        userId: userObj.id,
      },
    });

    await UserLike.destroy({
      where: {
        fromUserId: userObj.id,
      },
    })
  };

  controller.updateUser = async (req) => {
    isAuth(req);

    const params = req.allParams();
    const { id, role, firstName, lastName, email, avatar } = params
    let user = await User.findById(id);

    if (role || firstName || lastName || email || avatar) {
      const paramsToken = {
        id,
        role,
        firstName,
        lastName,
        email,
        avatar,
      };

      user.update(params);
      return {
        user,
        token: user.generateAuthToken(paramsToken),
      }
    }
    return user.update(params)
  };

  return controller
}
