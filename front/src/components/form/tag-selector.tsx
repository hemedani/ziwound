'use client';

import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

interface Tag {
  id: string;
  name: string;
  color?: string;
}

interface TagSelectorProps {
  label: string;
  description?: string;
  availableTags: Tag[];
  selectedTags: Tag[];
  onChange: (tags: Tag[]) => void;
  error?: string;
  creatable?: boolean;
}

export function TagSelector({
  label,
  description,
  availableTags = [],
  selectedTags = [],
  onChange,
  error,
  creatable = false,
}: TagSelectorProps) {
  const t = useTranslations('common');
  const [searchQuery, setSearchQuery] = useState('');
  const [newTagInput, setNewTagInput] = useState('');

  const filteredTags = availableTags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isSelected = (tagId: string) => selectedTags.some(t => t.id === tagId);

  const toggleTag = (tag: Tag) => {
    if (isSelected(tag.id)) {
      onChange(selectedTags.filter(t => t.id !== tag.id));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  const removeTag = (tagId: string) => {
    onChange(selectedTags.filter(t => t.id !== tagId));
  };

  const addNewTag = () => {
    if (newTagInput.trim() && creatable) {
      const newTag: Tag = {
        id: `new-${Date.now()}`,
        name: newTagInput.trim(),
      };
      onChange([...selectedTags, newTag]);
      setNewTagInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && creatable) {
      e.preventDefault();
      addNewTag();
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>

      {/* Selected tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map(tag => (
            <Badge key={tag.id} variant="secondary" className="gap-1">
              {tag.name}
              <button
                type="button"
                onClick={() => removeTag(tag.id)}
                className="ms-1 hover:text-destructive transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search input */}
      <Input
        type="text"
        placeholder={t('tagSelector.search')}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Available tags */}
      {filteredTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {filteredTags.map(tag => (
            <Badge
              key={tag.id}
              variant={isSelected(tag.id) ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer hover:opacity-80 transition-opacity',
                isSelected(tag.id) && 'pointer-events-none opacity-50'
              )}
              onClick={() => toggleTag(tag)}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      )}

      {/* Create new tag */}
      {creatable && (
        <div className="flex gap-2 mt-2">
          <Input
            type="text"
            placeholder={t('tagSelector.newTag')}
            value={newTagInput}
            onChange={(e) => setNewTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={addNewTag}
            disabled={!newTagInput.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  );
}
