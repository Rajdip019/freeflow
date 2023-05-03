/* eslint-disable no-undef */
import { db } from '@/lib/firebaseConfig';
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    Dispatch,
    SetStateAction,
} from 'react';
import { IUser } from '../interfaces/User';
import { useAuth } from './AuthContext';
import { useToast } from '@chakra-ui/react';
import { IReviewImageData } from '@/interfaces/ReviewImageData';

interface Props {
    children: JSX.Element[] | JSX.Element;
}

interface IDefaultValues {
    images: IReviewImageData[];
    setImages: Dispatch<SetStateAction<IReviewImageData[]>>;
    storage :  number,
    getImages : () => any
}

const defaultValues: IDefaultValues = {
    images: [],
    setImages: () => { },
    storage : 0,
    getImages  : () => {}
};

const imagesContext = createContext(defaultValues);

export function useImageContext() {
    return useContext(imagesContext);
}

export const ImageContextProvider = ({ children }: Props) => {
    const [images, setImages] = useState<IReviewImageData[]>(defaultValues.images);
    const [storage, setStorage] = useState<number>(defaultValues.storage)
    const { authUser } = useAuth();

    const getImages = async () => {
        const _images : IReviewImageData[] = []
        const imagesRef = collection(db, "reviewImages");
        const q = query(imagesRef, where("uploadedById" , "==", authUser?.uid));
        const querySnapShot = await getDocs(q);
        querySnapShot.forEach((doc) => {
            _images.push({ id : doc.id, ...doc.data() as IReviewImageData})
        })
        setImages(_images);
        if(_images.length !== 0){
            const sum = _images.reduce((accumulator, object : any) => {
              return accumulator + object.size;
            }, 0);
            const finalSum = Math.round((Math.round(sum * 100) / 100)/1024 *100) / 100 ;
            setStorage(finalSum)
        }
    }

    useEffect(() => {
        getImages();
    }, [])

    console.log(images);
    
    const value = {
        images,
        setImages,
        storage,
        getImages
    };

    return <imagesContext.Provider value={value}>{children}</imagesContext.Provider>;
};