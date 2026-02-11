import React, { useState } from 'react';
import { User, Mail, Camera, Edit2, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProfileHeader({ isEditing, setIsEditing }) {
    const { user, updateUserProfile } = useAuth();
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImage(true);
        setUploadProgress(0);

        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                setUploadProgress(percentComplete);
            }
        });

        // Handle completion
        xhr.addEventListener('load', async () => {
            if (xhr.status === 200) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    if (data.url) {
                        await updateUserProfile(user.uid, { photoURL: data.url });
                        toast.success('Profile Picture Updated');
                    } else {
                        throw new Error(data.error || 'Upload failed');
                    }
                } catch (error) {
                    console.error("Upload Error:", error);
                    toast.error('Failed to upload image. Please try again.');
                }
            } else {
                toast.error('Upload failed. Please try again.');
            }
            setUploadingImage(false);
            setUploadProgress(0);
        });

        // Handle errors
        xhr.addEventListener('error', () => {
            console.error("Upload Error");
            toast.error('Failed to upload image. Please try again.');
            setUploadingImage(false);
            setUploadProgress(0);
        });

        xhr.open('POST', 'https://unimarket-mw.com/api/upload.php');
        xhr.send(uploadFormData);
    };

    return (
        <div className="glass-thick p-8 md:p-12 rounded-[2.5rem] border border-border/30 shadow-premium relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <User size={200} strokeWidth={0.5} />
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                {/* Avatar Upload */}
                <div className="relative shrink-0">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] bg-secondary shadow-inner overflow-hidden border-4 border-white flex items-center justify-center relative group-upload">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User size={48} className="text-secondary-foreground/20" />
                        )}

                        {/* Upload Overlay */}
                        <label className={`absolute inset-0 bg-black/50 flex flex-col items-center justify-center transition-opacity cursor-pointer text-white ${uploadingImage ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
                            {uploadingImage ? (
                                <>
                                    <div className="text-2xl font-black mb-2">{uploadProgress}%</div>
                                    <div className="w-3/4 h-1 bg-white/20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-white transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </>
                            ) : (
                                <Camera size={24} />
                            )}
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                        </label>
                    </div>
                    <div className="absolute -bottom-3 -right-3 bg-white p-2 rounded-xl shadow-lg border border-border/10">
                        <span className="w-3 h-3 block rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                </div>

                <div className="space-y-2 flex-1 w-full">
                    <div className="flex justify-between items-start w-full">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Active Terminal</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-2">
                                {user?.firstname} {user?.lastname}
                            </h1>
                            <div className="flex items-center gap-2 text-muted-foreground font-medium">
                                <Mail size={14} />
                                <span>{user?.email}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`px-6 py-3 rounded-xl transition-all flex items-center gap-2 font-bold text-sm ${isEditing ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-secondary hover:bg-secondary/80'}`}
                        >
                            {isEditing ? <Check size={18} /> : <Edit2 size={18} />}
                            {isEditing ? 'Save Changes' : 'Edit Profile'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
