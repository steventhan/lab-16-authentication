'use strict';
const server = require('./_server');

server.listen(process.env.PORT || 3000, () => console.log('Server running at port 3000'));
