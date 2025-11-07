
import React, { useState, useCallback } from 'react';
import { editImage } from '../services/geminiService';

const ImagePlaceholder: React.FC = () => (
    <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
        <div className="text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-sm">Imagen aparecerá aquí</p>
        </div>
    </div>
);


const ImageEditor: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<{ data: string; file: File } | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setOriginalImage({ data: reader.result as string, file });
                setEditedImage(null);
                setError(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = useCallback(async () => {
        if (!originalImage || !prompt) {
            setError('Por favor, sube una imagen y escribe una instrucción.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setEditedImage(null);

        try {
            const result = await editImage(originalImage.data, originalImage.file.type, prompt);
            setEditedImage(result);
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error al editar la imagen.');
        } finally {
            setIsLoading(false);
        }
    }, [originalImage, prompt]);

    return (
        <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-lg">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Editor de Imágenes con IA</h2>
                <p className="mt-2 text-gray-600">Sube una imagen y dile a la IA cómo modificarla.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="flex flex-col items-center">
                    <h3 className="font-semibold text-lg mb-2">Imagen Original</h3>
                    {originalImage ? (
                        <img src={originalImage.data} alt="Original" className="w-full aspect-square object-contain rounded-lg shadow-md" />
                    ) : (
                        <ImagePlaceholder />
                    )}
                </div>
                 <div className="flex flex-col items-center">
                    <h3 className="font-semibold text-lg mb-2">Imagen Editada</h3>
                    {isLoading ? (
                        <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-300 h-12 w-12 mb-4 animate-spin border-t-violet-600"></div>
                        </div>
                    ) : editedImage ? (
                        <img src={editedImage} alt="Edited" className="w-full aspect-square object-contain rounded-lg shadow-md" />
                    ) : (
                        <ImagePlaceholder />
                    )}
                </div>
            </div>

            <div className="mt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <label className="w-full sm:w-1/2 cursor-pointer bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-center hover:bg-gray-50">
                        <span className="text-violet-600 font-medium">
                            {originalImage ? 'Cambiar Imagen' : 'Subir Imagen'}
                        </span>
                        <input type="file" accept="image/*" className="sr-only" onChange={handleImageUpload} />
                    </label>
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ej: 'Añadir un filtro retro', 'Quitar el fondo'"
                        className="w-full sm:w-1/2 form-input px-4 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                    />
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !originalImage || !prompt}
                    className="w-full mt-4 bg-violet-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-violet-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {isLoading ? 'Editando...' : 'Editar Imagen'}
                </button>
                {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            </div>
        </div>
    );
};

export default ImageEditor;
