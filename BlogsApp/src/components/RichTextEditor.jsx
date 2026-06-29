import { Controller } from 'react-hook-form'
import { Editor } from '@tinymce/tinymce-react'
import conf from '../conf/conf'
import PropTypes from "prop-types"

function RichTextEditor({ control, name, defaultValue = '', rules = {} }) {
    return (
        <Controller name={name} control={control} defaultValue={defaultValue} rules={rules} render={({ field: { onChange, value } }) => (
            <Editor apiKey={conf.tinyMCEApiKey} value={value} onEditorChange={onChange} init={{
                height: 480,
                menubar: 'edit view insert format tools',
                plugins: [
                    'advlist', 'autolink', 'lists', 'link',
                    'charmap', 'preview', 'searchreplace',
                    'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'table', 'codesample',
                ],
                toolbar:
                    'undo redo | formatselect | bold italic underline | ' +
                    'forecolor | alignleft aligncenter alignright | ' +
                    'bullist numlist outdent indent | codesample link | ' +
                    'removeformat code fullscreen',
                codesample_languages: [
                    { text: 'JavaScript', value: 'javascript' },
                    { text: 'TypeScript', value: 'typescript' },
                    { text: 'HTML', value: 'markup' },
                    { text: 'CSS', value: 'css' },
                    { text: 'Python', value: 'python' },
                    { text: 'Bash', value: 'bash' },
                ],
                content_style: `
                            body {
                                font-family: system-ui, -apple-system, sans-serif;
                                font-size: 15px;
                                line-height: 1.7;
                                color: #334155;
                                padding: 0.75rem 1rem;
                                margin: 0;
                            }
                        `,
            }}
            />
        )}
        />
    )
}

// PropTypes
RichTextEditor.propTypes = {
    control: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    defaultValue: PropTypes.string,
    rules: PropTypes.object,
}

export default RichTextEditor