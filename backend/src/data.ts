import database from "../data/model.json";
import databaseSagas from "../data/sagas.json";
import { OnePieceModel, OnePieceSaga } from "../../types/onepiece.model";

export const CHARACTERS = database as OnePieceModel[];
export const SAGAS = databaseSagas as OnePieceSaga[];
