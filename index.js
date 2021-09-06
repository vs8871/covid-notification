const https = require('https');
let messageBody;

var requestLoop = setInterval(function () {
    https.get('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=664&date=06-09-2021', (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            const d = JSON.parse(data);
            // console.log(JSON.parse(data));
            const availavleCenter = [];
            for (let index = 0; index < d?.centers?.length; index++) {
                for (let i = 0; i < d?.centers[index]?.sessions?.length; i++) {
                    const element = d?.centers[index]?.sessions[i]
                    if (element?.vaccine === 'COVISHIELD' && element?.available_capacity_dose2 > 0) {
                        const obj = {
                            date: d?.centers[index]?.sessions[i].date,
                            noOfDose: d?.centers[index]?.sessions[i]?.available_capacity_dose2,
                            pincode: d?.centers[index].pincode,
                            address: d?.centers[index].address,
                            district: d?.centers[index].district_name,
                            feeType: d?.centers[index].fee_type,
                            name: d?.centers[index].name
                        };
                        availavleCenter.push(obj);
                    }
                }
            }
            if (availavleCenter?.length > 0) {
                messageBody = JSON.stringify(availavleCenter);
                messageBody = messageBody.replaceAll('[', '').replaceAll(']', '')
                    .replaceAll('{', '').replaceAll('}', '').replaceAll(':', '=').replaceAll(',', '\n')
                    .replaceAll('"', '');
                if (messageBody?.length > 0) {
                    const id = 'AC7c06bba28a4c3a6d9a019e96e1134d36';
                    const token = '4decd9e0a9eb7b5a7f17da6485e2d699';

                    // Importing the Twilio module
                    const twilio = require('twilio');

                    // Creating a client
                    const client = twilio(id, token);
                    client.messages
                        .create({

                            // Message to be sent
                            body: messageBody,

                            // Senders Number (Twilio Sandbox No.)
                            from: 'whatsapp:+14155238886',

                            // Number receiving the message
                            to: 'whatsapp:917676476585'
                        })
                        .then(message => console.log("Message sent successfully"))
                        .done();
                }
            }
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}, 60000);
