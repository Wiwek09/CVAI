import React, {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  ChangeEvent,
} from 'react';

interface Tag {
  id: string;
  text: string;
}

interface InlineTagInputProps {
  onTagsChange: (tags: string[]) => void;
  tagsValue: boolean;
  placeholderText?: string;
}

const TagsInput: React.FC<InlineTagInputProps> = ({
  onTagsChange,
  tagsValue,
  placeholderText,
}) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [input, setInput] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [tags]);

  // Clear tags when tagsValue is false
  useEffect(() => {
    if (!tagsValue) {
      setTags([]); // Reset tags to an empty array
      setInput(''); // Reset input field
      onTagsChange([]); // Send empty tags to parent
    }
  }, [tagsValue, onTagsChange]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && input === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1].id);
    }
  };

  const addTag = () => {
    const trimmedInput = input.trim();
    if (trimmedInput && !tags.some((tag) => tag.text === trimmedInput)) {
      const newTags = [
        ...tags,
        { id: Date.now().toString(), text: trimmedInput },
      ];
      setTags(newTags);
      setInput('');
      onTagsChange(newTags.map((tag) => tag.text));
    }
  };

  const removeTag = (tagId: string) => {
    const newTags = tags.filter((tag) => tag.id !== tagId);
    setTags(newTags);
    onTagsChange(newTags.map((tag) => tag.text));
  };

  return (
    <div className='w-full max-w-sm mx-auto'>
      <div className='flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-gray-900'>
        {tags.map((tag) => (
          <span
            key={tag.id}
            className='bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center'
          >
            {tag.text}
            <button
              onClick={() => removeTag(tag.id)}
              className='ml-1 text-blue-600 hover:text-blue-800 focus:outline-none'
            >
              &times;
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type='text'
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder={tags.length === 0 ? placeholderText : ''}
          className='flex-grow w-52 outline-none bg-transparent'
        />
      </div>
    </div>
  );
};

export default TagsInput;
