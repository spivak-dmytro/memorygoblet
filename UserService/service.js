const userService = async (saga, prismaClient) => {
  const createUser = async (payload) => {
    const { name, email } = payload;
    const user = await prismaClient.user.create({
      data: {
        name,
        email,
      },
    });

    await saga.putToQueue('email-queue', {
      type: 'user.created',
      payload: user,
    });

    return user;
  }

  const getUsers = async () => {
    const users = await prismaClient.user.findMany();
    return users;
  }

  return {
    createUser,
    getUsers,
  }
}

export default userService;
