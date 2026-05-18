import os
import json
from pathlib import Path
from typing import List
from PIL import Image

def convert_png_to_webp(image_dir: str) -> List[str]:
    """Convert all PNG images in a directory to WebP format, quality=85, and remove original PNGs."""
    converted_files: List[str] = []
    dir_path = Path(image_dir)
    if not dir_path.exists():
        print(f"Directory {image_dir} does not exist.")
        return converted_files

    for file_path in dir_path.glob("*.png"):
        try:
            webp_path = file_path.with_suffix(".webp")
            with Image.open(file_path) as img:
                img.save(webp_path, "WEBP", quality=85)
            print(f"🖼️  Converted: {file_path.name} -> {webp_path.name}")
            os.remove(file_path)
            converted_files.append(file_path.name)
        except Exception as e:
            print(f"❌ Failed to convert {file_path.name}: {e}")

    return converted_files

def update_references_in_file(file_path: Path, old_ext: str, new_ext: str) -> bool:
    """Update all image extension occurrences inside a file."""
    if not file_path.exists():
        return False
    
    try:
        content: str = file_path.read_text(encoding="utf-8")
        updated_content: str = content.replace(old_ext, new_ext)
        if content != updated_content:
            file_path.write_text(updated_content, encoding="utf-8")
            print(f"✅ Updated image extensions in: {file_path}")
            return True
    except Exception as e:
        print(f"⚠️  Error updating {file_path}: {e}")
    
    return False

def main() -> None:
    """Main execution block to convert images and update references."""
    print("🚀 WebP Conversion Machine Started")
    print("=" * 60)
    
    image_dir: str = "assets/images"
    converted: List[str] = convert_png_to_webp(image_dir)
    print(f"✨ Converted {len(converted)} PNG files to WebP.")
    
    # Files to update references in
    files_to_update: List[Path] = [
        Path("assets/index.json"),
        Path("index.html"),
        Path("404.html"),
        Path("main.py"),
        Path("add_related_posts.py"),
        Path("index.md")
    ]
    
    # Scan posts directory (HTML and potential Markdown posts)
    posts_dir = Path("posts")
    if posts_dir.exists():
        for post_file in posts_dir.glob("*.html"):
            files_to_update.append(post_file)
            
    # Scan contact directory
    contact_dir = Path("contact")
    if contact_dir.exists():
        for contact_file in contact_dir.rglob("*.html"):
            files_to_update.append(contact_file)

    # Scan llms directory for markdown summaries
    llms_dir = Path("llms")
    if llms_dir.exists():
        for md_file in llms_dir.glob("*.md"):
            files_to_update.append(md_file)

    print("\n🔄 Updating all references across HTML, JSON, MD, and Python files...")
    updated_count: int = 0
    for file_path in files_to_update:
        if update_references_in_file(file_path, ".png", ".webp"):
            updated_count += 1
            
    print("=" * 60)
    print(f"🎉 Done! Converted images and updated references in {updated_count} files.")

if __name__ == "__main__":
    main()
