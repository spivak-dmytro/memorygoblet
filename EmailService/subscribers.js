const subscribers = (saga, service) => {
  saga.subscribeToCurrentQueue('user.created', async (user) => {
    await service.sendVerificationEmail(user);
  });
}

export default subscribers;
