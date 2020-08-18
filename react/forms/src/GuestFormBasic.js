import React from 'react';
import { AutoForm } from 'uniforms-bootstrap4';

import { bridge as schema } from './GuestSchema';

export default function GuestFormBasic() {
    return (
        <AutoForm schema={schema} onSubmit={console.log} />
    );
}