/*
SQLyog Community v13.1.9 (64 bit)
MySQL - 8.0.30-0ubuntu0.20.04.2 : Database - db_finance
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`db_finance` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

/*Table structure for table `account_details` */

DROP TABLE IF EXISTS `account_details`;

CREATE TABLE `account_details` (
  `accountNumber` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `openingBalance` float DEFAULT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `currentBalance` float DEFAULT NULL,
  `createDateTime` datetime DEFAULT CURRENT_TIMESTAMP,
  `recordUpdateTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `userType` enum('user','master') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`accountNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `account_details` */

insert  into `account_details`(`accountNumber`,`userId`,`openingBalance`,`type`,`status`,`currentBalance`,`createDateTime`,`recordUpdateTime`,`userType`) values 
(1,1,100,'svaing',1,100,'2022-08-26 18:32:12','2022-08-28 01:42:48','user'),
(2,1,100,'svaing',1,4900,'2022-08-26 18:34:15','2022-08-28 01:43:56','user'),
(3,1,100,'svaing',1,1330,'2022-08-26 18:37:45','2022-08-28 02:05:08','user'),
(4,1,100,'svaing',1,100,'2022-08-26 18:38:55','2022-08-28 01:42:54','user'),
(5,1,100,'svaing',1,9100,'2022-08-26 21:02:27','2022-08-28 01:44:28','user'),
(6,2,1000,'svaing',1,19000,'2022-08-26 21:48:30','2022-08-29 02:13:26','user'),
(7,2,1000,'svaing',1,31000,'2022-08-26 21:48:49','2022-08-28 01:45:11','user'),
(8,12,1000,'svaing',1,1360,'2022-08-27 16:32:58','2022-08-29 02:13:26','master'),
(9,13,1000,'svaing',1,61000,'2022-08-28 02:54:34','2022-08-28 03:00:49','user');

/*Table structure for table `transaction_details` */

DROP TABLE IF EXISTS `transaction_details`;

CREATE TABLE `transaction_details` (
  `trasactionId` int NOT NULL AUTO_INCREMENT,
  `fromAccountNumber` int NOT NULL,
  `toAccountNumber` int NOT NULL,
  `type` varchar(255) NOT NULL,
  `amount` float DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `isInstersetAdded` tinyint(1) DEFAULT '0',
  `percentageOfIntersetAdded` float DEFAULT '0',
  `commissionAmount` float DEFAULT '0',
  `totalAmountDedecuted` float DEFAULT '0',
  `description` mediumtext,
  `transactionThrough` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `transactionStartDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `transactionCompleteDate` datetime DEFAULT NULL,
  `recordUpdateTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`trasactionId`)
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `transaction_details` */

insert  into `transaction_details`(`trasactionId`,`fromAccountNumber`,`toAccountNumber`,`type`,`amount`,`status`,`isInstersetAdded`,`percentageOfIntersetAdded`,`commissionAmount`,`totalAmountDedecuted`,`description`,`transactionThrough`,`transactionStartDate`,`transactionCompleteDate`,`recordUpdateTime`) values 
(73,0,3,'Deposit',15000,'Completed',0,0,0,0,'self transfer','ATM','2022-08-28 01:43:23',NULL,'2022-08-28 01:43:23'),
(74,0,2,'Deposit',4800,'Completed',0,0,0,0,'self transfer','ATM','2022-08-28 01:43:56',NULL,'2022-08-28 01:43:56'),
(75,0,5,'Deposit',9000,'Completed',0,0,0,0,'self transfer','ATM','2022-08-28 01:44:28',NULL,'2022-08-28 01:44:28'),
(76,0,7,'Deposit',30000,'Completed',0,0,0,0,'self transfer','ATM','2022-08-28 01:45:11',NULL,'2022-08-28 01:45:11'),
(77,3,6,'Transfer',4500,'Completed',1,2,90,4590,'transfer','internet banking','2022-08-28 01:54:21',NULL,'2022-08-28 01:54:21'),
(78,3,8,'Deposit',90,'Completed',0,0,0,0,'commission','internet banking','2022-08-28 01:54:21',NULL,'2022-08-28 01:54:21'),
(79,3,6,'Transfer',4500,'Completed',1,2,90,4590,'transfer','internet banking','2022-08-28 02:00:28',NULL,'2022-08-28 02:00:28'),
(80,3,8,'Deposit',90,'Completed',0,0,0,0,'commission','internet banking','2022-08-28 02:00:28',NULL,'2022-08-28 02:00:28'),
(81,3,6,'Transfer',4500,'Completed',1,2,90,4590,'transfer','internet banking','2022-08-28 02:03:36',NULL,'2022-08-28 02:03:36'),
(82,3,8,'Deposit',90,'Completed',0,0,0,0,'commission','internet banking','2022-08-28 02:03:36',NULL,'2022-08-28 02:03:36'),
(83,0,9,'Deposit',30000,'Completed',0,0,0,0,'self transfer','ATM','2022-08-28 03:00:06',NULL,'2022-08-28 03:00:06'),
(84,0,9,'Deposit',30000,'Completed',0,0,0,0,'self transfer','ATM','2022-08-28 03:00:49',NULL,'2022-08-28 03:00:49'),
(85,3,8,'Deposit',90,'Completed',0,0,0,0,'commission','internet banking','2022-08-29 02:13:26',NULL,'2022-08-29 02:13:26');

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `middleName` varchar(30) DEFAULT NULL,
  `lastName` varchar(30) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `city` varchar(15) DEFAULT NULL,
  `mobile` varchar(10) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`userId`,`email`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `user` */

insert  into `user`(`userId`,`firstName`,`middleName`,`lastName`,`email`,`city`,`mobile`,`dob`,`isActive`) values 
(1,'Khyati','','bansal','khyati@am.in','delhi','9971525779','1989-07-23',0),
(2,'Piyush','','bansal','Piyush@am.in','delhi','981231231','1989-07-23',1),
(12,'Uday','','Kumar','uday@gmail.com','delhi','1234567890','1989-07-23',1),
(13,'Sanvi','','Gupta','sanvi@gmail.com','Delhi','1122334455','1989-07-23',1);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
