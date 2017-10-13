var express = require('express');
var router = express.Router();
var OTRS = require('otrs-telegram');
var { getNote } = require("../core");
var request     = require("request");
/* GET users listing. */
router.get('/:id', function(req, res, next) {

    let data = {};
    data.TicketID = req.params.id;
    data.query = req.query;
    data.telegram = {};
    OTRS.getTicket(data.TicketID).then((Ticket) => {

        data.telegram.chatID = Ticket.DynamicField[0].Value;

        data.telegram.body = Ticket.Article[0].Body;

        data.telegram.message = `${Ticket.Article[0].FromRealname} (Atendente):\n[TICKET#${Ticket.Article[0].TicketNumber}|${Ticket.Article[0].TicketID}]\n\nResposta: ${Ticket.Article[0].Body}`;
        
        if(Ticket.Article[0].FromRealname != "Telegram BOT"){
            request.get(`https://api.telegram.org/bot457248917:AAHTK6Ec5gLbuTj5lvFKyL6hlGZEPGhpozQ/sendMessage?chat_id=${data.telegram.chatID}&text=${encodeURIComponent(data.telegram.message)}`,(err,res,body) => {
                console.log(data.telegram.body);
            });
        }

       
    }).catch((err) => {
        console.log(err);
    })
    res.end();
});

module.exports = router;
