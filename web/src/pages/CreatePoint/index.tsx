import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';

import './styles.css';
import logo from '../../assets/logo.svg';

import Dropzone from '../../components/Dropzone';

import api from '../../services/api';
import axios from 'axios';

interface Carac {
    id: number;
    title: string;
    image_url: string;
}

interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

const CreatePoint = () => {
    const [caracs, setCaracs] = useState<Carac[]>([]);
    const [ufs, setUF] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    
    const [formData, setFormData] = useState({
        name: '',
    })
    const [initialPosition, setInitialPosition] = useState<[number,number]>([0,0]);

    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectedPosition, setSelectedPosition] = useState<[number,number]>([0,0]);
    const [selectedFile, setSelectedFile] = useState<File>();

    const history = useHistory();
    
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            console.log(position)
            setInitialPosition([latitude, longitude]);
        })
    },[])

    useEffect(()=>{
        api.get('caracs').then(response => {
            setCaracs(response.data);
        });
    },[])

    useEffect(()=>{
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla);

            setUF(ufInitials);
        });
    },[])

    useEffect(() => {
        if(selectedUf === '0'){
            return;
        }

        axios
            .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
            const cityNames = response.data.map(city => city.nome);

            setCities(cityNames);
        });
    },[selectedUf])

    function handleSelectedUf(event: ChangeEvent<HTMLSelectElement> ){
        const uf = event.target.value;
        setSelectedUf(uf);
    }

    function handleSelectedCity(event: ChangeEvent<HTMLSelectElement> ){
        const city = event.target.value;
        setSelectedCity(city);
    }

    function handleMapClick( event: LeafletMouseEvent){
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng,
        ])
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const { name, value } = event.target;

        setFormData({ ...formData, [name]: value})
    }

    function handleSelectedItem(id: number){
        const alreadySelected = selectedItems.findIndex(item => item === id);

        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id);

            setSelectedItems(filteredItems);
        } else {
            setSelectedItems([ ...selectedItems, id]);
        }
    }

    async function handleSubmit(event: FormEvent){
        event.preventDefault();

        const { name } = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const caracs = selectedItems;

        const data = new FormData();
        
            data.append('name',name);
            data.append('uf',uf);
            data.append('city',city);
            data.append('latitude',String(latitude));
            data.append('longitude',String(longitude));
            data.append('caracs',caracs.join(','));
            if (selectedFile){
                data.append('image',selectedFile)
            }

        await api.post('points', data);

        alert('Cachoeira Inserida no Mapa');

        history.push('/');
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Routa das Cachoeiras"/>

                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro de<br />Cachoeira</h1>

                <Dropzone onFileUploaded={setSelectedFile} />


                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                </fieldset>

                <div className="field">
                    <label htmlFor="name">Nome da Cachoeira:</label>
                    <input onChange={handleInputChange} name="name" id="name" type="text"/>
                </div>

                <fieldset>
                    <legend>
                        <h2>Endereços</h2>
                        <span>Selecione o local da Cachoeira no mapa</span>
                    </legend>

                    <Map center={[-22.0017818,-47.8972697]} zoom={15} onClick={handleMapClick} >
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={selectedPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select 
                                name="uf" 
                                id="uf" 
                                value={selectedUf} 
                                onChange={handleSelectedUf}
                            >
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf} >{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select 
                                name="city" 
                                id="city" 
                                value={selectedCity} 
                                onChange={handleSelectedCity} 
                            >
                                <option value="0">Selecione uma Cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city} >{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                </fieldset>
                
                <fieldset>
                    <legend>
                        <h2>Caracaterísticas</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {caracs.map(item => (
                            <li 
                                key={item.id} 
                                onClick={() => handleSelectedItem(item.id)} 
                                className={selectedItems.includes(item.id) ? 'selected' : '' }
                            >
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>
                        ))}

                    </ul>
                </fieldset>

                <button type="submit">
                    Cadastrar Cachoeira
                </button>
            </form>
        </div>
    )
}

export default CreatePoint;