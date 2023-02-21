-- CreateTable
CREATE TABLE "Memory" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Memory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToMemory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToMemory_AB_unique" ON "_CategoryToMemory"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToMemory_B_index" ON "_CategoryToMemory"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToMemory" ADD CONSTRAINT "_CategoryToMemory_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToMemory" ADD CONSTRAINT "_CategoryToMemory_B_fkey" FOREIGN KEY ("B") REFERENCES "Memory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
