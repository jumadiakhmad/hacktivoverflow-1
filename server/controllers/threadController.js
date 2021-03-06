var Thread = require('../models/threadModel');


function create(req, res) {
  let newThread = new Thread({
    title: req.body.title,
    threadContent: req.body.threadContent,
    creator: req.body.creator,
    createdAt: new Date()
  })
  newThread.save((err, createdThread) => {
    if(err) {
      res.send(err)
    } else {
      res.send(createdThread)
    }
  })
}

function get(req, res) {
  Thread.find({})
  .populate('creator')
  .exec(function (err, threads) {
    res.send(err ? err : threads)
  })
}

function getOne(req, res) {
  Thread.findById(req.params.id)
  .populate('creator')
  .populate('replies')
  .exec(function (err, thread) {
    res.send(err ? err : thread)
  })
}

function update(req, res) {
  Thread.findById(req.params.id, (err, thread) => {
    if(thread.creator == req.body.creator) {
      thread.title = req.body.title || thread.title
      thread.threadContent = req.body.threadContent || thread.threadContent
      thread.updatedAt = new Date()
      thread.save((err, editedThread) => {
        if(err) {
          res.send(err)
        } else {
          res.send(editedThread)
        }
      })
    } else {
      res.send('Not authorized')
    }
  })
}

function upvote(req, res) {
  Thread.findById(req.params.id, (err, thread) => {
    if(req.body.creator) {
      var idxUp = thread.upvotes.indexOf(req.body.creator);
      var idxDown = thread.downvotes.indexOf(req.body.creator);
      if(idxUp == -1 && idxDown == -1) {
        thread.upvotes.push(req.body.creator)
      } else if (idxDown !== -1) {
        thread.downvotes.splice(idxDown, 1)
      }
      thread.save((err, upvotedThread) => {
        if(err) {
          res.send(err)
        } else {
          res.send(upvotedThread)
        }
      })
    } else {
      res.send('Not authorized')
    }
  })
}

function downvote(req, res) {
  Thread.findById(req.params.id, (err, thread) => {
    if(req.body.creator) {
      var idxUp = thread.upvotes.indexOf(req.body.creator);
      var idxDown = thread.downvotes.indexOf(req.body.creator);
      if(idxUp == -1 && idxDown == -1) {
        thread.downvotes.push(req.body.creator)
      } else if (idxUp !== -1) {
        thread.upvotes.splice(idxDown, 1)
      }
      thread.save((err, downvotedThread) => {
        if(err) {
          res.send(err)
        } else {
          res.send(downvotedThread)
        }
      })
    } else {
      res.send('Not authorized')
    }
  })
}

function remove(req, res) {
  Thread.findOneAndRemove({_id: req.params.id}, (err, thread) => {
    if(err) res.send(err)
    res.send(thread)
  })
}

module.exports = {
  create, get, getOne, update, upvote, downvote, remove
};
