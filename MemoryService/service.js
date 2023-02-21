const MemoryService = async (saga, prismaClient) => {
  const createMemory = async (memoryData, categoryIds, userId) => {
    console.log('prismaClient', prismaClient);
    const newMemory = await prismaClient.memory.create({
      data: {
        ...memoryData,
        userId,
        categories: {
          connect: categoryIds.map((id) => ({ id })),
        },
      },
    });

    const memory = await prismaClient.memory.findUniqueOrThrow({
      where: { id: newMemory.id },
      include: { categories: true },
    });

    await saga.putToQueue('memory.created', memory);

    return { ...memory, categories: memory.categories.map(category => category.id) };
  };

  const updateMemory = async (memoryData, categoryIds, userId) => {
    const newMemory = await prismaClient.memory.update({
      where: { id: memoryData.id },
      data: {
        ...memoryData,
        userId,
        categories: {
          connect: categoryIds.map((id) => ({ id })),
        }
      }
    });

    const memory = await prismaClient.memory.findUniqueOrThrow({
      where: { id: newMemory.id },
      include: { categories: true },
    });

    await saga.putToQueue('email-queue', {
      type: 'memory.updated',
      payload: memory,
    });

    return { ...memory, categories: memory.categories.map(category => category.id) };
  }

  const getMemory = async (id) => {
    const memory = await prismaClient.memory.findUniqueOrThrow({
      where: { id },
      include: { categories: true },
    });

    return { ...memory, categories: memory.categories.map(category => category.id) };
  }

  return {
    createMemory,
    updateMemory,
    getMemory,
  };
}

export default MemoryService;
