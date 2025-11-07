
import React, { useState, useCallback } from 'react';
import { generateImage } from '../services/geminiService';

const ImagePlaceholder: React.FC = () => (
    <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
        <div className="text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-sm">Imagen generada aparecerá aquí</p>
        </div>
    </div>
);

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = useCallback(async () => {
        if (!prompt) {
            setError('Por favor, escribe una instrucción para generar la imagen.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const result = await generateImage(prompt);
            setGeneratedImage(result);
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error al generar la imagen.');
        } finally {
            setIsLoading(false);
        }
    }, [prompt]);

    return (
        <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-lg max-w-2xl mx-auto">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Generador de Imágenes con IA</h2>
                <p className="mt-2 text-gray-600">Describe la imagen que quieres crear.</p>
            </div>

            <div className="flex flex-col items-center">
                {isLoading ? (
                    <div className="w-full max-w-md aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-300 h-12 w-12 mb-4 animate-spin border-t-violet-600"></div>
                    </div>
                ) : generatedImage ? (
                    <img src={generatedImage} alt="Generated" className="w-full max-w-md aspect-square object-contain rounded-lg shadow-md" />
                ) : (
                    <div className="w-full max-w-md">
                        <ImagePlaceholder />
                    </div>
                )}
            </div>

            <div className="mt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ej: 'Un astronauta montando a caballo en Marte'"
                        className="w-full form-input px-4 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                    />
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !prompt}
                    className="w-full mt-4 bg-violet-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-violet-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {isLoading ? 'Generando...' : 'Generar Imagen'}
                </button>
                {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            </div>
        </div>
    );
};

export default ImageGenerator;
