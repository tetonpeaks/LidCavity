-- ----------------------------------------------------------------------------
-- MySQL Workbench Migration
-- Migrated Schemata: velocity
-- Source Schemata: velocity
-- Created: Tue Oct 17 14:25:36 2023
-- Workbench Version: 8.0.31
-- ----------------------------------------------------------------------------

SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- Schema velocity
-- ----------------------------------------------------------------------------
DROP SCHEMA IF EXISTS `velocity` ;
CREATE SCHEMA IF NOT EXISTS `velocity` ;

-- ----------------------------------------------------------------------------
-- Table velocity.alembic_version
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `velocity`.`alembic_version` (
  `version_num` VARCHAR(32) NOT NULL,
  PRIMARY KEY (`version_num`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- Table velocity.cfd
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `velocity`.`cfd` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `U` FLOAT NULL DEFAULT NULL,
  `Re` FLOAT NULL DEFAULT NULL,
  `N` INT NULL DEFAULT NULL,
  `Np` INT NULL DEFAULT NULL,
  `rowID` INT NULL DEFAULT NULL,
  `colID` INT NULL DEFAULT NULL,
  `axisU` TEXT NULL DEFAULT NULL,
  `axisV` TEXT NULL DEFAULT NULL,
  `axisID` VARCHAR(2) NOT NULL,
  `src` VARCHAR(100) NULL DEFAULT NULL,
  `simname` VARCHAR(100) NULL DEFAULT NULL,
  `DT` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 65
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- Table velocity.convergence
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `velocity`.`convergence` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `U` FLOAT NULL DEFAULT NULL,
  `Re` FLOAT NULL DEFAULT NULL,
  `N` INT NULL DEFAULT NULL,
  `Np` INT NULL DEFAULT NULL,
  `resid` TEXT NULL DEFAULT NULL,
  `src` VARCHAR(100) NULL DEFAULT NULL,
  `simname` VARCHAR(100) NULL DEFAULT NULL,
  `DT` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- Table velocity.displacement
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `velocity`.`displacement` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `U` FLOAT NULL DEFAULT NULL,
  `Re` FLOAT NULL DEFAULT NULL,
  `N` INT NULL DEFAULT NULL,
  `Np` INT NULL DEFAULT NULL,
  `rowID` INT NULL DEFAULT NULL,
  `colID` INT NULL DEFAULT NULL,
  `axisX` TEXT NULL DEFAULT NULL,
  `axisY` TEXT NULL DEFAULT NULL,
  `axisID` VARCHAR(2) NOT NULL,
  `src` VARCHAR(100) NULL DEFAULT NULL,
  `simname` VARCHAR(100) NULL DEFAULT NULL,
  `DT` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 20
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;
SET FOREIGN_KEY_CHECKS = 1;
