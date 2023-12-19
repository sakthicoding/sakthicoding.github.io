/*Adding authentication check*/
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase/firebase";

