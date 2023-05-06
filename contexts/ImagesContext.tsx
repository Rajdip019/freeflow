/* eslint-disable no-undef */
import { db } from '@/lib/firebaseConfig';
import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc, where } from 'firebase/firestore';
import {
    createContext,
    useContext,
    useState,
    useEffect,
    Dispatch,
    SetStateAction,
} from 'react';
import { useAuth } from './AuthContext';
import { IReviewImageData } from '@/interfaces/ReviewImageData';
import { useToast } from '@chakra-ui/react';

interface Props {
    children: JSX.Element[] | JSX.Element;
}

interface IDefaultValues {
    images: IReviewImageData[];
    setImages: Dispatch<SetStateAction<IReviewImageData[]>>;
    storage :  number,
    getImages : () => any,
    deleteImage : (image : IReviewImageData) =>  any
}

const defaultValues: IDefaultValues = {
    images: [],
    setImages: () => { },
    storage : 0,
    getImages  : () => {},
    deleteImage : () => { }
};

const imagesContext = createContext(defaultValues);

export function useImageContext() {
    return useContext(imagesContext);
}

export const ImageContextProvider = ({ children }: Props) => {
    const [images, setImages] = useState<IReviewImageData[]>(defaultValues.images);
    const [storage, setStorage] = useState<number>(defaultValues.storage)
    const { authUser } = useAuth();
    const toast = useToast();

    const getImages = async () => {
        if(authUser){
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
    }


    const deleteImage = async (image : IReviewImageData) => {
        await deleteDoc(doc(db, 'reviewImages',  image.id as string));
        toast({
            title: "Design Deleted Successfully.",
            description: "Please try again",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-right",
        });
        getImages();
    }   

    useEffect(() => {
        getImages();
    }, [authUser])

    console.log(images);
    
    const value = {
        images,
        setImages,
        storage,
        getImages,
        deleteImage
    };

    return <imagesContext.Provider value={value}>{children}</imagesContext.Provider>;
};