
const Room = require('../models/Room');
const Customer = require('../models/Customer');
const Bill = require('../models/Bill');
const Service = require('../models/Service');
const { multipleToObject } = require('../../config/utility/mongoose');
const { mongooseToObject } = require('../../config/utility/mongoose');
const { db } = require('../models/Customer');

const showCheckIn = async (req, res, next) => {
    // const roomBooked = await Customer.find({ c_status: 'Đã xác nhận' }).populate('room.roomID')
    // const emptyRooms = await Room.find({ r_status: 'còn trống'});
    // var result = multipleToObject(roomBooked);
    // for (var i in result) {
    //     result[i].c_checkin = result[i].c_checkin.toLocaleDateString('en-GB');
    //     result[i].c_checkout = result[i].c_checkout.toLocaleDateString('en-GB');
    // }
    // res.render('TabCheckInAdmin/checkInAdmin', {
    //     layout: 'mainAdmin.hbs',
    //     rooms: multipleToObject(emptyRooms),
    //     roomBooked: result
    // });
    const roomBooked = await Customer.find({ c_status: 'Đã xác nhận' }).populate('room.roomID')
    const emptyRooms = await Room.find({ r_status: 'còn trống'});
    const availableRooms = await Room.find({ r_status: {$nin: ['còn trống', 'không phục vụ']}, c_checkin: {$gt: new Date()}});
    
    var rooms = [];
    // Xử lý lưu phòng trống
    for(let i in emptyRooms) {
        let room = {
            r_name: emptyRooms[i].r_name,
            r_price: emptyRooms[i].r_price,
            r_type: emptyRooms[i].r_type,
            r_status: emptyRooms[i].r_status,
            r_people: emptyRooms[i].r_people,
            r_number: emptyRooms[i].r_number,
            r_number: emptyRooms[i].r_number,
            dayRent: {
                checkin_date: '',
                checkout_date: ''
            }
        }
        rooms.push(room);
    }
    // Xử lý lưu phòng available
    for(let i in availableRooms) {
        const customer = await Customer.findOne({"room.roomID": availableRooms[i]._id, c_status: {$in: ['Đang checkin', 'Đã xác nhận']}});
        let room = {
            r_name: availableRooms[i].r_name,
            r_price: availableRooms[i].r_price,
            r_type: availableRooms[i].r_type,
            r_status: availableRooms[i].r_status,
            r_people: availableRooms[i].r_people,
            r_number: availableRooms[i].r_number,
            r_number: availableRooms[i].r_number,
            dayRent: {
                checkin_date: customer.c_checkin,
                checkout_date: customer.c_checkout
            }
        }
        rooms.push(room);
    }
    for (var i in rooms) {
        if(rooms[i].dayRent.checkin_date !== '' && rooms[i].dayRent.checkout_date !== '') {
            rooms[i].dayRent.checkin_date = rooms[i].dayRent.checkin_date.toLocaleDateString('en-GB');
            rooms[i].dayRent.checkout_date = rooms[i].dayRent.checkout_date.toLocaleDateString('en-GB');
        }
    }
    res.render('TabCheckInAdmin/checkInAdmin', {
        layout: 'mainAdmin.hbs',
        roomBooked: roomBooked,
        rooms: rooms,
    });
}

const showCheckInBooking = async (req, res, next) => {
    const emptyRooms = await Room.find({ r_status: 'còn trống' });
    const roomBooked = await Customer.find({ c_status: 'Đã xác nhận' }).populate('room.roomID')
    var cusList = multipleToObject(roomBooked);
    for (var i in cusList) {
        cusList[i].c_checkin = cusList[i].c_checkin.toLocaleDateString('en-GB');
        cusList[i].c_checkout = cusList[i].c_checkout.toLocaleDateString('en-GB');
    }
    const cusBooked = await Customer.findById(req.params.id).populate('room.roomID');
    var result = mongooseToObject(cusBooked);
    result.c_checkin = result.c_checkin.toLocaleDateString('en-GB');
    result.c_checkout = result.c_checkout.toLocaleDateString('en-GB');

    res.render('TabCheckInAdmin/checkInBooking', {
        layout: 'mainAdmin.hbs',
        rooms: multipleToObject(emptyRooms),
        roomBooked: cusList,
        cusBooked: result
    });
}

const showCheckInList = async (req, res, next) => {
    const roomsCheckIn = await Customer.find({ c_status: 'Đang checkin' }).populate('room.roomID')
    var result = multipleToObject(roomsCheckIn);
    for (var i in result) {
        result[i].c_checkin = result[i].c_checkin.toLocaleDateString('en-GB');
        result[i].c_checkout = result[i].c_checkout.toLocaleDateString('en-GB');
    }
    res.render('TabCheckInAdmin/checkInList', {
        layout: 'mainAdmin.hbs',
        customers: result
    });
}
//[POST] /checkIn/:id/checkInBooking/taophieu
const taophieu = async (req, res, next) => {
    const customer = await Customer.findOne({ _id: req.params.id });
    await Customer.updateOne(
        { _id: req.params.id },
        { $set: { c_status: 'Đang checkin' } });

    await Room.updateOne(
        { _id: customer.room.roomID },
        { $set: { r_status: 'đang sử dụng' } }
    );

    const bill = new Bill(req.body);
    bill.customerID = customer.id;
    bill.save()
    res.redirect('/admin/checkIn')
}
const store = async (req, res, next) => {
    var roomPrice = await Room.findOne({ r_number: req.body.r_number});
    roomPrice.r_price = roomPrice.r_price.replace(/,/g, '');

    var customer = new Customer({
        c_name: req.body.c_name,
        c_phone: req.body.c_phone,
        c_email: req.body.c_email,
        c_checkin: new Date(req.body.c_checkin),
        c_checkout: new Date(req.body.c_checkout),
        c_total: req.body.c_total,
        room: {
            roomID: roomPrice._id,
            price: parseFloat(roomPrice.r_price)
        }
    });

    const room = await Room.findOne({ r_number: req.body.r_number })
    customer.c_status = 'Đang checkin';
    customer.room.roomID = room._id;

    await Room.findOneAndUpdate(
        { _id: customer.room.roomID },
        { r_status: 'đang sử dụng' },
        { new: true }
    );
    const bill = new Bill(req.body);
    bill.customerID = customer.id;
    bill.save()

    customer.save()
        .then(() => res.redirect('/admin/checkIn'))
        .catch(next);
}
const edit = async (req, res, next) => {
    const emptyRooms = await Room.find({ r_status: 'còn trống' });
    const customer = await Customer.findById(req.params.id).populate('room.roomID');


    var result = mongooseToObject(customer);
    result.c_checkin = result.c_checkin.toISOString().split('T')[0];
    result.c_checkout = result.c_checkout.toISOString().split('T')[0];

    res.render('TabCheckInAdmin/checkInDetail', {
        layout: 'mainAdmin.hbs',
        customers: result,
        rooms: multipleToObject(emptyRooms)
    })
}
const update = async (req, res, next) => {
    Customer.updateOne({ _id: req.params.id }, req.body)
        .then(() => res.redirect('/admin/checkIn/list'))
        .catch(next);
}
const showDetail = async (req, res, next) => {
    const customer = await Customer.findOne({ _id: req.params.id });
    const bill = await Bill.findOne({ customerID: customer._id });
    const room = await Room.findOne({ _id: customer.room.roomID });
    const services = await Service.find();
    var result = mongooseToObject(customer);
    result.c_checkin = result.c_checkin.toLocaleDateString('en-GB');
    result.c_checkout = result.c_checkout.toLocaleDateString('en-GB');
    var day_ms = (customer.c_checkout - customer.c_checkin);
    var dayrent = day_ms / 86400000;
    var total = result.room.price * dayrent;
    result.room.price = Intl.NumberFormat().format(result.room.price);
    res.render('TabBillAdmin/billDetail', {
        layout: 'mainAdmin.hbs',
        bill: mongooseToObject(bill),
        customer: result,
        dayRent: dayrent,
        total: total,
        room: mongooseToObject(room),
        services: multipleToObject(services)
    });
}

const updateBill = async (req, res, next) => {
    const { sv_name, sv_type, sv_price, sv_qty, sv_total, bill_total } = req.body;
    const { id } = req.params;
    if (typeof sv_name === 'object') {
        var services = [];
        for (let i in sv_name) {
            var service = {
                name: sv_name[i],
                type: sv_type[i],
                price: sv_price[i],
                qty: sv_qty[i],
                total: sv_total[i]
            };
            services.push(service);
        }
        await Bill.updateOne(
            { _id: id },
            { $set: { b_service: services, b_total: bill_total } }
        )

    }
    else {
        var services = [];
        var service = {
            name: sv_name,
            type: sv_type,
            price: sv_price,
            qty: sv_qty,
            total: sv_total
        };
        services.push(service);
        await Bill.updateOne(
            { _id: id },
            { $set: { b_service: services, b_total: bill_total } }
        )
    }
    res.redirect('back')
}

const checkoutBill = async (req, res, next) => {
    await Bill.updateOne({ _id: req.params.id }, { $set: { b_status: 'Đã thanh toán' } });
    var bill = await Bill.findOne({ _id: req.params.id });
    await Customer.updateOne({ _id: bill.customerID }, { $set: { c_status: 'Đã thanh toán' } });
    var customer = await Customer.findOne({ _id: bill.customerID });
    await Room.updateOne({ _id: customer.room.roomID }, { $set: { r_status: 'còn trống' } });
    if(bill.b_total == 0) {
        await Bill.updateOne({ _id: req.params.id }, { $set: { b_total: customer.c_total} });
    }
    res.redirect('/admin/bill');
}


module.exports = { showCheckIn, showCheckInBooking, showCheckInList, taophieu, store, edit, update, showDetail, updateBill, checkoutBill };


