import prismaC from "../config/prismaClient";
import MemoryService from '../service';
import rb from 'rabbitbox/dist';
import sinon from 'sinon';

const { Saga } = rb;

describe('MemoryService', () => {
  let prismaClient;
  let memoryService;
  let sandbox;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    prismaClient = {
      memory: {
        create: sandbox.stub().resolves({ id: '123' }),
        findUniqueOrThrow: sandbox.stub().resolves({
          id: '123',
          userId: '1',
          categories: [
            { id: '1' },
            { id: '2' },
            { id: '3' },
          ]
        })
      }
    };
    sandbox.stub(prismaC, 'getPrismaClient').returns(prismaClient);
    sandbox.stub(Saga, 'build').resolves();

    memoryService = await MemoryService();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('createMemory', () => {
    it('should create a new memory and return it with connected categories', async () => {
      const memoryData = { title: 'Test memory' };
      const categoryIds = ['1', '2', '3'];

      const result = await memoryService.createMemory(memoryData, categoryIds);

      expect(prismaClient.memory.create.calledOnce).toBe(true);
      expect(prismaClient.memory.findUniqueOrThrow.calledOnce).toBe(true);
      expect(result).toEqual({
        id: '123',
        userId: '1',
        categories: ['1', '2', '3']
      });
    });
  });
});
