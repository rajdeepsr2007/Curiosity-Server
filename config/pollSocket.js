const socketIO = require('socket.io');
const User = require('../models/user/index');
const Poll = require('../models/poll/poll');
const Option = require('../models/poll/option/option');
const Vote = require('../models/poll/vote/vote');

module.exports.createPollServer = (server) => {
    const io=socketIO(server , {
        cors: {
          origin: "http://3.141.21.117:3000",
          credentials: true
        }
    });
    ioObject = io;
    io.sockets.on('connection' , socket => {

        socket.emit('connected');

        socket.on('disconnect' , () => {
            console.log('disconnected');
        })
        socket.on('join-poll' , (data) => {
            socket.join(
                data.pollId
            )
            socket.join(
                data.userId
            )
            socket.emit('poll-joined');
        })
        socket.on('vote' , async (data) => {

            if( data && data.userId && data.pollId && data.optionId ){
                const user = await User.findById(data.userId);
                const poll = await Poll.findById(data.pollId);
                const option = await Option.findById(data.optionId);

                
                if( user && poll && option ){

                    const vote = await Vote.findOne({
                        user : user._id ,
                        poll : poll._id ,
                    })

                    if( vote ){
                        if( vote.option == data.optionId ){
                            await vote.remove();
                            option.votes = parseInt(option.votes) - 1;
                            await option.save();
                            poll.votes = parseInt(poll.votes) - 1;
                            await poll.save();
                            io.to(data.pollId).emit('vote-update',{
                                votes : {
                                    [option._id] : -1
                                }
                            })
                            socket.emit('vote-update',{
                                selected : '-'
                            })
                            
                        }else{
                            const selectedOption = vote.option;
                            const soption = await Option.findById(selectedOption);
                            soption.votes = parseInt(soption.votes) - 1;
                            await soption.save();
                            vote.option = option._id;
                            await vote.save();
                            option.votes = parseInt(option.votes) + 1;
                            await option.save();
                            io.to(data.pollId).emit('vote-update',{
                                votes : {
                                    [ selectedOption ] : -1 ,
                                    [ option._id ] : 1 
                                }
                            })
                            socket.emit('vote-update' ,{
                                selected : data.optionId
                            })
                        }

                    }else{
                        await Vote.create({
                            user : user._id ,
                            poll : poll._id ,
                            option : option._id
                        })
                        option.votes = parseInt(option.votes) + 1;
                        await option.save();
                        poll.votes = parseInt(poll.votes) + 1;
                        await poll.save();
                        io.to(data.pollId).emit('vote-update',{
                            votes :  {
                                [option._id] : 1 
                            }
                        })
                        socket.emit('vote-update' ,{
                            selected : data.optionId
                        })
                    } 
                }

            }    

        })
    })   
}