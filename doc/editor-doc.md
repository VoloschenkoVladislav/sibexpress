# EditorJS blocks documentation

Updated at: 2024.08.25

## 1. Main structure of editor's raw content

Editor always return JSON structure with 3 necessary fields:

| Field   |             Type               |      Description     |
|---------|--------------------------------|----------------------|
| time    | number                         | Saving timestamp     |
| blocks  | {type: string, data: object}[] | List of Blocks data  |
| version | string                         | Version of Editor.js |

Example:
```
{
  "time": 1724602422132,
  "blocks": [],
  "version": "2.30.2"
}
```

## 2. Blocks data

Blocks data using in editor's output contains 3 fields:

| Field |             Type    |      Description     |
|-------|---------------------|----------------------|
| id    | string              | Block id             |
| type  | string              | Block type           |
| data  | Object<any> or null | Block data           |

Example:
```
{
  "id": "XV87kJS_H1",
  "type": "list",
  "data": null
}
```

## 3. Data types

### 3.1. Heading

| Field |  Type  |      Description            |
|-------|--------|-----------------------------|
| text  | string | Heading text                |
| level | number | Heading level (from 1 to 6) |

**Heading level**:

| Heading level | Description |
|---------------|-------------|
| 1             | h1 heading  |
| 2             | h2 heading  |
| 3             | h3 heading  |
| 4             | h4 heading  |
| 5             | h5 heading  |
| 6             | h6 heading  |

Example:
```
{
  "id": "AOulAjL8XM",
  "type": "header",
  "data": {
    "text": "What does it mean «block-styled editor»",
    "level": 3
  }
}
```

### 3.2. Paragraph

| Field |   Type  |  Description   |
|-------|---------|----------------|
| text  | string  | Paragraph text |

Example:
```
{
  "id": "zbGZFPM-iI",
  "type": "paragraph",
  "data": {
    "text": "Hey. Meet the new Editor. On this page you can see it in action — try to edit this text. Source code of the page contains the example of connection and configuration."
  }
}
```

### 3.3. List

| Field | Type      |      Description   |
|-------|-----------|--------------------|
| style | string    | List style         |
| items | string[]  | List's item's text |

**List style**:

| List style | Description    |
|------------|----------------|
| ordered    | Odrered list   |
| unordered  | Unordered list |

Example:
```
{
  "id": "XV87kJS_H1",
  "type": "list",
  "data": {
    "style": "unordered",
    "items": [
      "It is a block-styled editor",
      "It returns clean data output in JSON",
      "Designed to be extendable and pluggable with a simple API"
    ]
  }
}
```

### 3.4. Simple image

| Field | Type      |  Description    |
|-------|-----------|-----------------|
| src   | string    | Source of image |

Example:
```
{
  "id": "f0Aaiiv45u",
  "type": "simpleImage",
  "data": {
    "src": "https://sib.express/img_posts/0/71/2_oKGXfIVcqT.jpg"
  }
}
```

### 3.5. Table

|    Field     | Type       |      Description         |
|--------------|------------|--------------------------|
| withHeadings | boolean    | Does table have headings |
| content      | string[][] | Content of table's cells |

Example:
```
{
  "id": "f0Aaiiv45u",
  "type": "table",
  "data": {
    "withHeadings": true,
    "content": [
      [
        "Table",
        "Column",
        ""
      ],
      [
        "Row 1",
        "Cell 1",
        "Cell 3"
      ],
      [
        "Row 2",
        "",
        "Cell 4"
      ]
    ]
  }
}
```

### 3.6. Raw HTML

| Field | Type      |  Description    |
|-------|-----------|-----------------|
| html  | string    | Raw HTML string |

Example:
```
{
  "id": "f0Aaiiv45u",
  "type": "rawTool",
  "data": {
    "html": "<p>Test fragment</p>"
  }
}
```

### 3.7. Code

| Field | Type      | Description |
|-------|-----------|-------------|
| code  | string    | Code text   |

Example:
```
{
  "id": "f0Aaiiv45u",
  "type": "code",
  "data": {
    "code": "function goodLogic() {\nif (true) {\n  return false;\n} else {\n  return true;\n}\n}\n"
  }
}
```

### 3.8. Quote

|   Field   | Type      |  Description   |
|-----------|-----------|----------------|
| text      | string    | Code text      |
| caption   | string    | Code text      |
| alignment | string    | Alignment type |

**Alignment type**:

| Alignment type | Description  |
|----------------|--------------|
| left           | Align left   |
| center         | Align center |

Example:
```
{
  "id": "f0Aaiiv45u",
  "type": "code",
  "data": {
    "text": "Quote",
    "caption": "Caption",
    "alignment": "left"
  }
}
```

### 3.9. Delimiter

Delimiter accept only empty object as data.

Example:
```
{
  "id": "f0Aaiiv45u",
  "type": "code",
  "data": {}
}
```
