import { useRef, useState } from "react";

const aspect = "aspect-square";

export default function MediaGallery({
  items,
  onAddFiles,
  onRemove,
  onSetFeatured,
  onReorder,
  featuredUrl,
}) {
  const inputRef = useRef(null);
  const [dragIndex, setDragIndex] = useState(null);

  const handleFiles = (event) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length) onAddFiles(files);
    event.target.value = "";
  };

  const handleDropEnd = () => setDragIndex(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
        {items.map((item, index) => (
          <div
            key={item.key}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (dragIndex === null || dragIndex === index) return;
              onReorder(dragIndex, index);
              setDragIndex(null);
            }}
            onDragEnd={handleDropEnd}
            className={`group relative ${aspect} cursor-grab overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200 transition ${
              dragIndex === index ? "opacity-50" : ""
            }`}
          >
            <img
              src={item.url}
              alt=""
              className="h-full w-full object-cover"
            />
            {item.url === featuredUrl ? (
              <span className="absolute left-1.5 top-1.5 rounded bg-amber-400 px-1.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                Featured
              </span>
            ) : null}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black/60 to-transparent p-1.5 opacity-0 transition group-hover:opacity-100">
              <span className="text-[10px] font-medium text-white">
                {item.file ? "New" : "Image"}
              </span>
              <span className="flex items-center gap-1">
                {item.url !== featuredUrl ? (
                  <button
                    type="button"
                    title="Set as featured"
                    onClick={() => onSetFeatured(item.url)}
                    className="rounded bg-white/20 p-1 text-white transition hover:bg-white/40"
                  >
                    ★
                  </button>
                ) : null}
                <button
                  type="button"
                  title="Remove image"
                  onClick={() => onRemove(item.key)}
                  className="rounded bg-white/20 p-1 text-white transition hover:bg-red-500"
                >
                  🗑
                </button>
              </span>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`flex ${aspect} flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-300 text-slate-500 transition hover:border-slate-400 hover:text-slate-700`}
        >
          <span className="text-2xl font-light">+</span>
          <span className="px-2 text-center text-xs font-medium">
            Add media
          </span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="hidden"
      />

      <p className="text-xs text-slate-500">
        Drag thumbnails to reorder. Hover an image to set it as featured or
        remove it. The first image is the featured image.
      </p>
    </div>
  );
}