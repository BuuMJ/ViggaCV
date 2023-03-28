const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Company = new Schema(
    {
        iduser: String,
        companyname: String,
        companyaddress: String,
        faxcode: String,
        taxcode: String,
        companyemail: String,
        companyphone: String,
        companyyears: String,
        typeofbusiness: String,
        companydesc: String,
        avatar: String,
        background: String,
    },
    {
        collection: 'company',
    }
)

const CompanyModel = mongoose.model('company', Company);
module.exports = CompanyModel;