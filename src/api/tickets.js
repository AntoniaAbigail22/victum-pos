const fs = require('fs');
const path = require('path');
const ticketsPath = path.join(__dirname, 'tickets.json');

function readTickets() {
  try {
    const data = fs.readFileSync(ticketsPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeTickets(tickets) {
  fs.writeFileSync(ticketsPath, JSON.stringify(tickets, null, 2));
}

function crearTicket(ticket) {
  const tickets = readTickets();
  ticket.id = tickets.length ? tickets[tickets.length - 1].id + 1 : 1;
  ticket.fecha = new Date().toISOString();
  tickets.push(ticket);
  writeTickets(tickets);
  return { success: true, ticket };
}

function listarTickets() {
  return readTickets();
}

module.exports = {
  crearTicket,
  listarTickets,
};
