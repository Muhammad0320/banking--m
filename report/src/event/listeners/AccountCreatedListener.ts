export class AccountCreatedListener {
  readonly subject = Subjects.AccountCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: AccountCreatedEvent['data'], msg: Message) {
    await Account.buildAccount({
      ...data,
      userId: data.user.id
    });

    msg.ack();
  }
}
