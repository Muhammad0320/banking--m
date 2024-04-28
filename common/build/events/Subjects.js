"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subjects = void 0;
var Subjects;
(function (Subjects) {
    Subjects["AccountCreated"] = "account:created";
    Subjects["AccountBlocked"] = "account:blocked";
    Subjects["AccountUpdated"] = "account:updated";
    Subjects["AccountUnblocked"] = "account:unblocked";
    //
    Subjects["UserCreated"] = "user:created";
    Subjects["UserUpdated"] = "user:updated";
    //
    Subjects["TxnDepositCreated"] = "txnDeposit:created";
    Subjects["TxnWithdrawalCreated"] = "txnWithdrawal:created";
    Subjects["TxnTransferCreated"] = "txnTransfer:created";
})(Subjects || (exports.Subjects = Subjects = {}));
