SQLite format 3   @                                                                     -��   �    �����                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          P++Ytablesqlite_sequencesqlite_sequenceCREATE TABLE sqlite_sequence(name,seq)�z!!�?tablecategoriescategoriesCREATE TABLE `categories` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `title` VARCHAR(255) NOT NULL UNIQUE, `image` VARCHAR(255) DEFAULT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, UNIQUE (title))3G! indexsqlite_autoindex_catego   
      	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          � t ��t�                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    P++Ytablesqlite_sequencesqlite_sequenceCREATE TABLE sqlite_sequence(name,seq)�z!!�?tablecategoriescategoriesCREATE TABLE `categories` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `title` VARCHAR(255) NOT NULL UNIQUE, `image` VARCHAR(255) DEFAULT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, UNIQUE (title))3G! indexsqlite_autoindex_categories_1categories          7 7/                                                                                                                                                                                                                                                                                                        �F�ktableusersusersCREATE TABLE `users` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `firstName` VARCHAR(255), `lastName` VARCHAR(255), `role` TEXT NOT NULL DEFAULT 'user', `type` TEXT NOT NULL DEFAULT 'user', `gender` TEXT DEFAULT 'male', `avatar` VARCHAR(255), `email` VARCHAR(255) NOT NULL, `status` VARCHAR(255) DEFAULT 'ACTIVE', `gyfi` INTEGER NOT NULL DEFAULT 0, `banned` TINYINT(1) NOT NULL DEFAULT 0, `phoneNumber` VARCHAR(255) NOT NULL, `city` VARCHAR(255), `referal` INTEGER REFERENCES `users` (`id`), `bdate` DATETIME, `productsCount` INTEGER NOT NULL DEFAULT 0, `likes` INTEGER NOT NULL DEFAULT 0, `dislikes` INTEGER NOT NULL DEFAULT 0, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 � ��                                                                                                                                                                                                                                                                                                                                                                                                     �i�)tableactionsactionsCREATE TABLE `actions` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `title` VARCHAR(255) NOT NULL, `categoryId` INTEGER NOT NULL REFERENCES `categories` (`id`), `ownerId` INTEGER NOT NULL REFERENCES `users` (`id`), `winnerId` INTEGER REFERENCES `users` (`id`), `fixedWinnerId` INTEGER REFERENCES `users` (`id`), `image` VARCHAR(255) DEFAULT 'http://wmz-pwnz.ru/sites/default/files/no_avatar.jpg', `finishedAt` DATETIME NOT NULL, `status` TEXT DEFAULT 'REVIEW', `description` VARCHAR(255) DEFAULT '', `vipTime` DATETIME DEFAULT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  � � � �                                                                                                                                                                                                                     �>�[tablewallswallsCREATE TABLE `walls` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `userId` INTEGER REFERENCES `users` (`id`), `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL)�V�tableproductsproducts
CREATE TABLE `products` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `title` VARCHAR(255) NOT NULL, `price` INTEGER, `ownerId` INTEGER NOT NULL REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, `categoryId` INTEGER NOT NULL REFERENCES `categories` (`id`), `buyerId` INTEGER REFERENCES `users` (`id`), `status` TEXT NOT NULL DEFAULT 'REVIEW', `image` VARCHAR(255) DEFAULT 'http://wmz-pwnz.ru/sites/default/files/no_avatar.jpg', `description` VARCHAR(255) DEFAULT '', `vipTime` DATETIME DEFAULT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                ' �G '                     �
�tablelikeslikesCREATE TABLE `likes` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `fromUserId` INTEGER NOT NULL REFERENCES `users` (`id`), `toUserId` INTEGER REFERENCES `users` (`id`), `value` INTEGER NOT NULL DEFAULT 1, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL)�e	�)tablepostspostsCREATE TABLE `posts` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `message` VARCHAR(255) NOT NULL, `userId` INTEGER NOT NULL REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, `wallId` INTEGER NOT NULL REFERENCES `walls` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL)�N�stableticketsticketsCREATE TABLE `tickets` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `userId` INTEGER NOT NULL REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, `actionId` INTEGER NOT NULL REFERENCES `actions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               ��  o��[tableMessagesMessagesCREATE TABLE `Messages` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `text` VARCHAR(255) NOT NULL, `data` [object Object] DEFAULT '', `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, `toUserId` INTEGER REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE, `fromUserId` INTEGER REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE)�H�gtabledevicesdevicesCREATE TABLE `devices` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `deviceId` VARCHAR(255) NOT NULL, `token` VARCHAR(255) NOT NULL, `type` VARCHAR(255) NOT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, `userId` INTEGER REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE)�))�qtablesocialNetworkssocialNetworksCREATE TABLE `socialNetworks` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `userId` INTEGER NOT NULL REFERENCES `users` (`id`), `type` TEXT NOT NULL, `networkId` VARCHAR(255) NOT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            