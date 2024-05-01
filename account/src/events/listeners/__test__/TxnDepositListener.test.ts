import { AccountCurrency, TxnDepositCreatedEvent, UserRole } from "@m0banking/common"
import { natsWrapper } from "../../../natswrapper"
import { TxnDepositedListener } from "../TxnDepositCretaedListener"
import Account from "../../../model/account"
import { User } from "../../../model/user"
import mongoose from "mongoose"
import { AccountTier } from "../../../enums/AccountTier"
import { AccountType } from "../../../enums/AccountTypeEnum"



const setup = async () => {


    const listener = new TxnDepositedListener(natsWrapper.client)

    const user = await User.buildUser({ id: new mongoose.Types.ObjectId().toHexString(), password: 'shitpassword', 

    email: 'shitman@gmail.com',
    name: "Lisan al-gaib",
    role: UserRole.User,
    version: 0


     })

    const account = await Account.buildAccount({

        pin: '1234',
pinConfirm: '1234',

user,
tier: AccountTier.Basic,
currency: AccountCurrency.USD,
type: AccountType.Current

    })

    const data: TxnDepositCreatedEvent['data'] = {

        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        account: {
            id: account.id,
            version: account.version,
            balance: account.balace,
        }

    }



    return { listener, data, account }


}


